import type { AiConfig } from "./ai.js";

const FALLBACK_CLAUDE_MODEL = "claude-sonnet-4-6";
const FALLBACK_OPENAI_MODEL = "gpt-4o";

export interface AiCallOptions {
  provider: string;
  model: string;
}

export async function callAI(
  system: string,
  user: string,
  config: AiConfig,
  opts: AiCallOptions
): Promise<string> {
  if (opts.provider === "claude") {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: config.apiKey });

    const model = opts.model || FALLBACK_CLAUDE_MODEL;
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    });

    type TextContent = Extract<(typeof response.content)[number], { type: "text" }>;
    return response.content
      .filter((b): b is TextContent => b.type === "text")
      .map((b) => b.text)
      .join("");
  }

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: config.apiKey });

  const model = opts.model || FALLBACK_OPENAI_MODEL;
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return response.choices[0]?.message.content ?? "";
}

export async function streamAI(
  system: string,
  user: string,
  config: AiConfig,
  onChunk: (text: string) => void,
  opts: AiCallOptions
): Promise<void> {
  if (opts.provider === "claude") {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: config.apiKey });

    const model = opts.model || FALLBACK_CLAUDE_MODEL;
    const stream = anthropic.messages.stream({
      model,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        onChunk(event.delta.text);
      }
    }
    return;
  }

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: config.apiKey });

  const model = opts.model || FALLBACK_OPENAI_MODEL;
  const stream = await openai.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) onChunk(text);
  }
}
