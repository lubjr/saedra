# Bedrock Service

Type-safe AWS Bedrock integration with Zod validation and event-driven streaming.

## Features

- **Type-Safe**: Full TypeScript support with Zod runtime validation
- **Event-Driven**: Built-in event emitters for streaming and monitoring
- **Modern API**: Support for Claude Messages API
- **Streaming**: Real-time response streaming with chunks
- **Validated**: All inputs and outputs validated with Zod schemas

## Installation

```bash
npm install @repo/bedrock-service
```

## Basic Usage

### Standard Model Invocation

```typescript
import { BedrockService } from "@repo/bedrock-service/bedrock";

const bedrock = new BedrockService({
  region: "us-east-1",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
  },
});

const response = await bedrock.invokeModel("anthropic.claude-v2", {
  prompt: "Hello, how are you?",
  config: {
    temperature: 0.7,
    maxTokens: 1000,
  },
});

console.log(response.completion);
```

### Messages API (Modern Claude API)

```typescript
const response = await bedrock.invokeWithMessages("anthropic.claude-3-sonnet-20240229-v1:0", {
  messages: [
    { role: "user", content: "What is the capital of France?" },
  ],
  config: {
    temperature: 0.5,
    maxTokens: 500,
  },
});

console.log(response.completion);
// Output: "The capital of France is Paris."
```

### Streaming Responses

```typescript
// Listen to stream events
bedrock.on("streamChunk", (chunk) => {
  if (!chunk.isComplete) {
    process.stdout.write(chunk.chunk);
  }
});

bedrock.on("streamComplete", (response) => {
  console.log("\n\nFull response:", response.completion);
  console.log("Tokens used:", response.metadata?.outputTokens);
});

// Invoke with streaming
const response = await bedrock.invokeModelStream("anthropic.claude-v2", {
  prompt: "Tell me a story about a brave knight.",
  config: {
    temperature: 0.8,
    maxTokens: 2000,
  },
});
```

### Streaming with Messages API

```typescript
bedrock.on("streamChunk", (chunk) => {
  if (!chunk.isComplete) {
    process.stdout.write(chunk.chunk);
  }
});

const response = await bedrock.invokeWithMessagesStream(
  "anthropic.claude-3-sonnet-20240229-v1:0",
  {
    messages: [
      { role: "user", content: "Explain quantum computing in simple terms." },
    ],
    config: {
      temperature: 0.7,
      maxTokens: 1500,
    },
  }
);
```

## Event Handling

The service emits various events you can listen to:

```typescript
import { BedrockService } from "@repo/bedrock-service/bedrock";

const bedrock = new BedrockService({ region: "us-east-1" });

// Stream events
bedrock.on("streamStart", (modelId) => {
  console.log(`Stream started for model: ${modelId}`);
});

bedrock.on("streamChunk", (chunk) => {
  console.log(`Chunk ${chunk.index}: ${chunk.chunk}`);
});

bedrock.on("streamComplete", (response) => {
  console.log("Stream complete:", response);
});

bedrock.on("streamError", (error) => {
  console.error("Stream error:", error);
});

// General events
bedrock.on("modelInvoked", (modelId, tokensUsed) => {
  console.log(`Model ${modelId} used ${tokensUsed} tokens`);
});

bedrock.on("error", (error) => {
  console.error("Service error:", error);
});
```

## Advanced: Multi-Turn Conversations

```typescript
const messages = [
  { role: "user", content: "What is TypeScript?" },
];

const response1 = await bedrock.invokeWithMessages(
  "anthropic.claude-3-sonnet-20240229-v1:0",
  { messages }
);

// Add assistant response and continue conversation
messages.push({ role: "assistant", content: response1.completion });
messages.push({ role: "user", content: "How is it different from JavaScript?" });

const response2 = await bedrock.invokeWithMessages(
  "anthropic.claude-3-sonnet-20240229-v1:0",
  { messages }
);

console.log(response2.completion);
```

## Type Safety with Zod

All requests and responses are validated with Zod:

```typescript
import { BedrockRequestSchema } from "@repo/bedrock-service/bedrock";

// This will throw a Zod validation error
try {
  const invalidRequest = BedrockRequestSchema.parse({
    prompt: "", // Empty prompt not allowed
    config: {
      temperature: 2.0, // Temperature must be between 0 and 1
    },
  });
} catch (error) {
  console.error("Validation error:", error);
}
```

## Listing Available Models

```typescript
const models = await bedrock.listModels();

models.forEach((model) => {
  console.log(`Model: ${model.modelId}`);
  console.log(`Provider: ${model.provider}`);
  console.log(`Input: ${model.inputModalities?.join(", ")}`);
  console.log(`Output: ${model.outputModalities?.join(", ")}`);
  console.log("---");
});
```

## AWS Configuration

Make sure you have:

- AWS credentials configured (via environment variables, credentials file, or IAM Role)
- Required permissions for Bedrock:
  - `bedrock:InvokeModel`
  - `bedrock:InvokeModelWithResponseStream`
  - `bedrock:ListFoundationModels`
- AWS region that supports Bedrock (e.g., `us-east-1`, `us-west-2`)

## Configuration Options

```typescript
interface BedrockConfig {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

interface BedrockModelConfig {
  modelId: string;
  temperature?: number; // 0-1
  maxTokens?: number; // Positive integer
  topP?: number; // 0-1
  topK?: number; // Positive integer
  stopSequences?: string[];
}
```

## Error Handling

```typescript
try {
  const response = await bedrock.invokeModel("anthropic.claude-v2", {
    prompt: "Hello!",
  });
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
}

// Or use events
bedrock.on("error", (error) => {
  console.error("Service error:", error);
});
```

## TypeScript Types

All types are exported for use in your application:

```typescript
import type {
  BedrockConfig,
  BedrockRequest,
  BedrockResponse,
  MessagesRequest,
  StreamChunk,
  ModelInfo,
} from "@repo/bedrock-service/bedrock";
```

## License

MIT
