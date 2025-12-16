import { EventEmitter } from "events";
import type { StreamChunk, BedrockResponse } from "./schemas.js";

/**
 * Event types for the Bedrock service
 */
export interface BedrockServiceEvents {
  // Streaming events
  streamStart: (modelId: string) => void;
  streamChunk: (chunk: StreamChunk) => void;
  streamComplete: (response: BedrockResponse) => void;
  streamError: (error: Error) => void;

  // General events
  modelInvoked: (modelId: string, tokensUsed: number) => void;
  error: (error: Error) => void;
}

/**
 * Type-safe event emitter for Bedrock service
 */
export class BedrockEventEmitter extends EventEmitter {
  // Override emit and on methods for type safety
  emit<K extends keyof BedrockServiceEvents>(
    event: K,
    ...args: Parameters<BedrockServiceEvents[K]>
  ): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof BedrockServiceEvents>(
    event: K,
    listener: BedrockServiceEvents[K]
  ): this {
    return super.on(event, listener);
  }

  once<K extends keyof BedrockServiceEvents>(
    event: K,
    listener: BedrockServiceEvents[K]
  ): this {
    return super.once(event, listener);
  }

  off<K extends keyof BedrockServiceEvents>(
    event: K,
    listener: BedrockServiceEvents[K]
  ): this {
    return super.off(event, listener);
  }
}

/**
 * Stream response aggregator
 * Collects chunks and emits complete response
 */
export class StreamAggregator {
  private chunks: string[] = [];
  private tokenCount = 0;

  addChunk(chunk: string): void {
    this.chunks.push(chunk);
  }

  addTokens(count: number): void {
    this.tokenCount += count;
  }

  getComplete(): string {
    return this.chunks.join("");
  }

  getTokenCount(): number {
    return this.tokenCount;
  }

  reset(): void {
    this.chunks = [];
    this.tokenCount = 0;
  }
}
