export interface BedrockConfig {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export interface BedrockModelConfig {
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface BedrockRequest {
  prompt: string;
  config?: Partial<BedrockModelConfig>;
}

export interface BedrockResponse {
  completion: string;
  metadata?: {
    inputTokens?: number;
    outputTokens?: number;
    stopReason?: string;
  };
}
