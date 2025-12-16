import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import {
  BedrockClient,
  ListFoundationModelsCommand,
} from "@aws-sdk/client-bedrock";
import {
  BedrockConfigSchema,
  BedrockRequestSchema,
  MessagesRequestSchema,
  BedrockResponseSchema,
  type BedrockConfig,
  type BedrockRequest,
  type BedrockResponse,
  type MessagesRequest,
  type StreamChunk,
  type ModelInfo,
} from "./schemas.js";
import { BedrockEventEmitter, StreamAggregator } from "./events.js";

export class BedrockService extends BedrockEventEmitter {
  private runtimeClient: BedrockRuntimeClient;
  private bedrockClient: BedrockClient;

  constructor(config: BedrockConfig) {
    super();

    // Validate config with Zod
    const validatedConfig = BedrockConfigSchema.parse(config);

    const clientConfig = {
      region: validatedConfig.region,
      ...(validatedConfig.credentials && {
        credentials: validatedConfig.credentials,
      }),
    };

    this.runtimeClient = new BedrockRuntimeClient(clientConfig);
    this.bedrockClient = new BedrockClient(clientConfig);
  }

  /**
   * List available foundation models
   */
  async listModels(): Promise<ModelInfo[]> {
    try {
      const command = new ListFoundationModelsCommand({});
      const response = await this.bedrockClient.send(command);

      return (
        response.modelSummaries?.map((model) => ({
          modelId: model.modelId || "",
          modelName: model.modelName,
          provider: model.providerName,
          inputModalities: model.inputModalities,
          outputModalities: model.outputModalities,
          customizationsSupported: model.customizationsSupported,
        })) || []
      );
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to list models");
      this.emit("error", err);
      throw err;
    }
  }

  /**
   * Invoke model with standard request/response
   */
  async invokeModel(
    modelId: string,
    request: BedrockRequest
  ): Promise<BedrockResponse> {
    try {
      // Validate request with Zod
      const validatedRequest = BedrockRequestSchema.parse(request);

      const input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          prompt: validatedRequest.prompt,
          temperature: validatedRequest.config?.temperature || 0.7,
          max_tokens: validatedRequest.config?.maxTokens || 1000,
          top_p: validatedRequest.config?.topP || 0.9,
          ...(validatedRequest.config?.topK && {
            top_k: validatedRequest.config.topK,
          }),
          ...(validatedRequest.config?.stopSequences && {
            stop_sequences: validatedRequest.config.stopSequences,
          }),
        }),
      };

      const command = new InvokeModelCommand(input);
      const response = await this.runtimeClient.send(command);

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      const result: BedrockResponse = {
        completion:
          responseBody.completion || responseBody.results?.[0]?.outputText || "",
        metadata: {
          inputTokens: responseBody.inputTextTokenCount,
          outputTokens: responseBody.results?.[0]?.tokenCount,
          stopReason: responseBody.stopReason,
        },
      };

      // Validate response
      const validatedResponse = BedrockResponseSchema.parse(result);

      // Emit event
      const tokensUsed =
        (validatedResponse.metadata?.inputTokens || 0) +
        (validatedResponse.metadata?.outputTokens || 0);
      this.emit("modelInvoked", modelId, tokensUsed);

      return validatedResponse;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to invoke model");
      this.emit("error", err);
      throw err;
    }
  }

  /**
   * Invoke model with Messages API (modern Claude API)
   */
  async invokeWithMessages(
    modelId: string,
    request: MessagesRequest
  ): Promise<BedrockResponse> {
    try {
      // Validate request
      const validatedRequest = MessagesRequestSchema.parse(request);

      const input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          messages: validatedRequest.messages,
          max_tokens: validatedRequest.config?.maxTokens || 1000,
          temperature: validatedRequest.config?.temperature || 0.7,
          ...(validatedRequest.config?.topP && {
            top_p: validatedRequest.config.topP,
          }),
          ...(validatedRequest.config?.topK && {
            top_k: validatedRequest.config.topK,
          }),
          ...(validatedRequest.config?.stopSequences && {
            stop_sequences: validatedRequest.config.stopSequences,
          }),
        }),
      };

      const command = new InvokeModelCommand(input);
      const response = await this.runtimeClient.send(command);

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      const result: BedrockResponse = {
        completion: responseBody.content?.[0]?.text || "",
        metadata: {
          inputTokens: responseBody.usage?.input_tokens,
          outputTokens: responseBody.usage?.output_tokens,
          stopReason: responseBody.stop_reason,
        },
      };

      // Validate response
      const validatedResponse = BedrockResponseSchema.parse(result);

      // Emit event
      const tokensUsed =
        (validatedResponse.metadata?.inputTokens || 0) +
        (validatedResponse.metadata?.outputTokens || 0);
      this.emit("modelInvoked", modelId, tokensUsed);

      return validatedResponse;
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to invoke model with messages");
      this.emit("error", err);
      throw err;
    }
  }

  /**
   * Invoke model with streaming response
   */
  async invokeModelStream(
    modelId: string,
    request: BedrockRequest
  ): Promise<BedrockResponse> {
    try {
      // Validate request
      const validatedRequest = BedrockRequestSchema.parse(request);

      const input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          prompt: validatedRequest.prompt,
          temperature: validatedRequest.config?.temperature || 0.7,
          max_tokens: validatedRequest.config?.maxTokens || 1000,
          top_p: validatedRequest.config?.topP || 0.9,
          ...(validatedRequest.config?.topK && {
            top_k: validatedRequest.config.topK,
          }),
          ...(validatedRequest.config?.stopSequences && {
            stop_sequences: validatedRequest.config.stopSequences,
          }),
        }),
      };

      const command = new InvokeModelWithResponseStreamCommand(input);
      const response = await this.runtimeClient.send(command);

      this.emit("streamStart", modelId);

      const aggregator = new StreamAggregator();
      let chunkIndex = 0;

      if (response.body) {
        for await (const event of response.body) {
          if (event.chunk) {
            const chunkData = JSON.parse(
              new TextDecoder().decode(event.chunk.bytes)
            );

            const chunkText =
              chunkData.completion ||
              chunkData.delta?.text ||
              chunkData.outputText ||
              "";

            if (chunkText) {
              aggregator.addChunk(chunkText);

              const streamChunk: StreamChunk = {
                chunk: chunkText,
                index: chunkIndex++,
                isComplete: false,
              };

              this.emit("streamChunk", streamChunk);
            }

            // Track tokens
            if (chunkData.outputTextTokenCount) {
              aggregator.addTokens(chunkData.outputTextTokenCount);
            }
          }
        }
      }

      // Emit final chunk
      const finalChunk: StreamChunk = {
        chunk: "",
        index: chunkIndex,
        isComplete: true,
      };
      this.emit("streamChunk", finalChunk);

      const result: BedrockResponse = {
        completion: aggregator.getComplete(),
        metadata: {
          outputTokens: aggregator.getTokenCount(),
        },
      };

      const validatedResponse = BedrockResponseSchema.parse(result);
      this.emit("streamComplete", validatedResponse);

      return validatedResponse;
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to stream model");
      this.emit("streamError", err);
      this.emit("error", err);
      throw err;
    }
  }

  /**
   * Invoke model with streaming using Messages API
   */
  async invokeWithMessagesStream(
    modelId: string,
    request: MessagesRequest
  ): Promise<BedrockResponse> {
    try {
      // Validate request
      const validatedRequest = MessagesRequestSchema.parse(request);

      const input = {
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          messages: validatedRequest.messages,
          max_tokens: validatedRequest.config?.maxTokens || 1000,
          temperature: validatedRequest.config?.temperature || 0.7,
          ...(validatedRequest.config?.topP && {
            top_p: validatedRequest.config.topP,
          }),
          ...(validatedRequest.config?.topK && {
            top_k: validatedRequest.config.topK,
          }),
          ...(validatedRequest.config?.stopSequences && {
            stop_sequences: validatedRequest.config.stopSequences,
          }),
        }),
      };

      const command = new InvokeModelWithResponseStreamCommand(input);
      const response = await this.runtimeClient.send(command);

      this.emit("streamStart", modelId);

      const aggregator = new StreamAggregator();
      let chunkIndex = 0;
      let inputTokens = 0;
      let outputTokens = 0;

      if (response.body) {
        for await (const event of response.body) {
          if (event.chunk) {
            const chunkData = JSON.parse(
              new TextDecoder().decode(event.chunk.bytes)
            );

            // Handle different chunk types
            if (chunkData.type === "message_start") {
              inputTokens = chunkData.message?.usage?.input_tokens || 0;
            } else if (chunkData.type === "content_block_delta") {
              const chunkText = chunkData.delta?.text || "";
              if (chunkText) {
                aggregator.addChunk(chunkText);

                const streamChunk: StreamChunk = {
                  chunk: chunkText,
                  index: chunkIndex++,
                  isComplete: false,
                };

                this.emit("streamChunk", streamChunk);
              }
            } else if (chunkData.type === "message_delta") {
              outputTokens = chunkData.usage?.output_tokens || 0;
            }
          }
        }
      }

      // Emit final chunk
      const finalChunk: StreamChunk = {
        chunk: "",
        index: chunkIndex,
        isComplete: true,
      };
      this.emit("streamChunk", finalChunk);

      const result: BedrockResponse = {
        completion: aggregator.getComplete(),
        metadata: {
          inputTokens,
          outputTokens,
        },
      };

      const validatedResponse = BedrockResponseSchema.parse(result);
      this.emit("streamComplete", validatedResponse);

      return validatedResponse;
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to stream model with messages");
      this.emit("streamError", err);
      this.emit("error", err);
      throw err;
    }
  }
}
