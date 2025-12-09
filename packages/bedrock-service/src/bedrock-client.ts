import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";
import type { BedrockConfig, BedrockRequest, BedrockResponse } from "./types.js";

export class BedrockService {
  private runtimeClient: BedrockRuntimeClient;
  private bedrockClient: BedrockClient;

  constructor(config: BedrockConfig) {
    const clientConfig = {
      region: config.region,
      ...(config.credentials && { credentials: config.credentials }),
    };

    this.runtimeClient = new BedrockRuntimeClient(clientConfig);
    this.bedrockClient = new BedrockClient(clientConfig);
  }

  async listModels() {
    const command = new ListFoundationModelsCommand({});
    const response = await this.bedrockClient.send(command);
    return response.modelSummaries || [];
  }

  async invokeModel(
    modelId: string,
    request: BedrockRequest
  ): Promise<BedrockResponse> {
    // Base structure - needs to be adapted based on model provider
    const input = {
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: request.prompt,
        temperature: request.config?.temperature || 0.7,
        max_tokens: request.config?.maxTokens || 1000,
        top_p: request.config?.topP || 0.9,
      }),
    };

    const command = new InvokeModelCommand(input);
    const response = await this.runtimeClient.send(command);

    // Parse response - structure depends on the model
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return {
      completion: responseBody.completion || responseBody.results?.[0]?.outputText || "",
      metadata: {
        inputTokens: responseBody.inputTextTokenCount,
        outputTokens: responseBody.results?.[0]?.tokenCount,
        stopReason: responseBody.stopReason,
      },
    };
  }
}
