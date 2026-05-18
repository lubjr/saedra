import { describe, test, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
const mockStream = vi.fn();
const mockChatCreate = vi.fn();

vi.mock("@anthropic-ai/sdk", () => ({
  default: vi.fn(() => ({ messages: { create: mockCreate, stream: mockStream } })),
}));

vi.mock("openai", () => ({
  default: vi.fn(() => ({ chat: { completions: { create: mockChatCreate } } })),
}));

const { callAI, streamAI } = await import("../commands/ai-client.js");

const MOCK_CONFIG = { apiKey: "sk-ant-test-key" };
const MOCK_CLAUDE_OPTS = { provider: "claude", model: "claude-sonnet-4-6" };
const MOCK_OPENAI_OPTS = { provider: "openai", model: "gpt-4o" };

const MOCK_SYSTEM = "You are a helpful assistant.";
const MOCK_USER = "Explain the architecture.";

describe("ai-client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("callAI", () => {
    test("calls Claude API and returns concatenated text content", async () => {
      mockCreate.mockResolvedValue({
        content: [
          { type: "text", text: "Hello " },
          { type: "thinking", thinking: "..." },
          { type: "text", text: "World" },
        ],
      });

      const result = await callAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, MOCK_CLAUDE_OPTS);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          system: MOCK_SYSTEM,
          messages: [{ role: "user", content: MOCK_USER }],
        })
      );
      expect(result).toBe("Hello World");
    });

    test("calls OpenAI API and returns message content", async () => {
      mockChatCreate.mockResolvedValue({
        choices: [{ message: { content: "OpenAI response" } }],
      });

      const result = await callAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, MOCK_OPENAI_OPTS);

      expect(mockChatCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [
            { role: "system", content: MOCK_SYSTEM },
            { role: "user", content: MOCK_USER },
          ],
        })
      );
      expect(result).toBe("OpenAI response");
    });

    test("returns empty string when OpenAI returns no choices", async () => {
      mockChatCreate.mockResolvedValue({ choices: [] });

      const result = await callAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, MOCK_OPENAI_OPTS);

      expect(result).toBe("");
    });

    test("uses the model from opts", async () => {
      mockCreate.mockResolvedValue({ content: [{ type: "text", text: "Response" }] });

      await callAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, { provider: "claude", model: "claude-opus-4-6" });

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: "claude-opus-4-6" })
      );
    });

    test("uses claude-sonnet model when specified", async () => {
      mockCreate.mockResolvedValue({ content: [{ type: "text", text: "Fast response" }] });

      await callAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, MOCK_CLAUDE_OPTS);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: "claude-sonnet-4-6" })
      );
    });
  });

  describe("streamAI", () => {
    test("streams text chunks from Claude and calls onChunk for each", async () => {
      async function* mockAsyncGen() {
        yield { type: "content_block_delta", delta: { type: "text_delta", text: "Hello " } };
        yield { type: "content_block_delta", delta: { type: "text_delta", text: "World" } };
        yield { type: "message_stop" };
      }
      mockStream.mockReturnValue(mockAsyncGen());

      const chunks: string[] = [];
      await streamAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, (text) => chunks.push(text), MOCK_CLAUDE_OPTS);

      expect(chunks).toEqual(["Hello ", "World"]);
    });

    test("ignores non-text-delta events when streaming from Claude", async () => {
      async function* mockAsyncGen() {
        yield { type: "message_start" };
        yield { type: "content_block_delta", delta: { type: "thinking_delta", thinking: "..." } };
        yield { type: "content_block_delta", delta: { type: "text_delta", text: "Result" } };
      }
      mockStream.mockReturnValue(mockAsyncGen());

      const chunks: string[] = [];
      await streamAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, (text) => chunks.push(text), MOCK_CLAUDE_OPTS);

      expect(chunks).toEqual(["Result"]);
    });

    test("streams text chunks from OpenAI and calls onChunk for each", async () => {
      async function* mockAsyncGen() {
        yield { choices: [{ delta: { content: "Hello " } }] };
        yield { choices: [{ delta: { content: "World" } }] };
        yield { choices: [{ delta: {} }] };
      }
      mockChatCreate.mockResolvedValue(mockAsyncGen());

      const chunks: string[] = [];
      await streamAI(MOCK_SYSTEM, MOCK_USER, MOCK_CONFIG, (text) => chunks.push(text), MOCK_OPENAI_OPTS);

      expect(chunks).toEqual(["Hello ", "World"]);
    });
  });
});
