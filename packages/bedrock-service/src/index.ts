// Main service export
export { BedrockService } from "./bedrock-client.js";

// Event emitter exports
export { BedrockEventEmitter, StreamAggregator } from "./events.js";
export type { BedrockServiceEvents } from "./events.js";

// Type exports from Zod schemas
export type {
  BedrockConfig,
  BedrockModelConfig,
  BedrockRequest,
  BedrockResponse,
  BedrockResponseMetadata,
  Message,
  MessagesRequest,
  StreamChunk,
  ModelInfo,
} from "./schemas.js";

// Schema exports for advanced usage
export {
  BedrockConfigSchema,
  BedrockModelConfigSchema,
  BedrockRequestSchema,
  BedrockResponseSchema,
  BedrockResponseMetadataSchema,
  MessageSchema,
  MessagesRequestSchema,
  StreamChunkSchema,
  ModelInfoSchema,
} from "./schemas.js";
