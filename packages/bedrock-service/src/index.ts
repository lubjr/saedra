export { BedrockService } from "./bedrock-client.js";

export { BedrockEventEmitter, StreamAggregator } from "./events.js";
export type { BedrockServiceEvents } from "./events.js";

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
