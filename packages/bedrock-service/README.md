# Bedrock Service

Package for AWS Bedrock integration.

## Initial Setup

This package provides a basic structure for working with AWS Bedrock, including:

- Configured client for Bedrock Runtime
- TypeScript types for requests and responses
- Base methods to invoke models

## Basic Usage

```typescript
import { BedrockService } from "@repo/bedrock-service/bedrock";

const bedrock = new BedrockService({
  region: "us-east-1",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
  },
});

const models = await bedrock.listModels();

const response = await bedrock.invokeModel("anthropic.claude-v2", {
  prompt: "Hello, how are you?",
  config: {
    temperature: 0.7,
    maxTokens: 1000,
  },
});
```

## AWS Configuration

Make sure you have:
- AWS credentials configured (via environment variables, credentials file, or IAM Role)
- Required permissions for Bedrock (bedrock:InvokeModel, bedrock:ListFoundationModels)
- AWS region that supports Bedrock

## Next Steps

This is an initial setup. You can extend it with:
- Specific support for different providers (Claude, Llama, etc.)
- Response streaming
- Embeddings
- Context and history management
- Rate limiting and retry logic
