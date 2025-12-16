import { z } from "zod";

/**
 * Zod schemas for runtime validation and type safety
 */

// Configuration schemas
export const BedrockConfigSchema = z.object({
  region: z.string().min(1, "Region is required"),
  credentials: z
    .object({
      accessKeyId: z.string(),
      secretAccessKey: z.string(),
    })
    .optional(),
});

export const BedrockModelConfigSchema = z.object({
  modelId: z.string(),
  temperature: z.number().min(0).max(1).optional(),
  maxTokens: z.number().positive().optional(),
  topP: z.number().min(0).max(1).optional(),
  topK: z.number().positive().optional(),
  stopSequences: z.array(z.string()).optional(),
});

// Request schemas
export const BedrockRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  config: BedrockModelConfigSchema.partial().optional(),
});

// Messages API schema (modern Claude API)
export const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const MessagesRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1, "At least one message is required"),
  config: BedrockModelConfigSchema.partial().optional(),
});

// Response schemas
export const BedrockResponseMetadataSchema = z.object({
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
  stopReason: z.string().optional(),
});

export const BedrockResponseSchema = z.object({
  completion: z.string(),
  metadata: BedrockResponseMetadataSchema.optional(),
});

// Streaming chunk schema
export const StreamChunkSchema = z.object({
  chunk: z.string(),
  index: z.number(),
  isComplete: z.boolean(),
});

// Model info schema
export const ModelInfoSchema = z.object({
  modelId: z.string(),
  modelName: z.string().optional(),
  provider: z.string().optional(),
  inputModalities: z.array(z.string()).optional(),
  outputModalities: z.array(z.string()).optional(),
  customizationsSupported: z.array(z.string()).optional(),
});

// Export inferred types from schemas
export type BedrockConfig = z.infer<typeof BedrockConfigSchema>;
export type BedrockModelConfig = z.infer<typeof BedrockModelConfigSchema>;
export type BedrockRequest = z.infer<typeof BedrockRequestSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type MessagesRequest = z.infer<typeof MessagesRequestSchema>;
export type BedrockResponse = z.infer<typeof BedrockResponseSchema>;
export type BedrockResponseMetadata = z.infer<
  typeof BedrockResponseMetadataSchema
>;
export type StreamChunk = z.infer<typeof StreamChunkSchema>;
export type ModelInfo = z.infer<typeof ModelInfoSchema>;
