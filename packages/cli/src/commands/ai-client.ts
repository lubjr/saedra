import type { AiConfig } from "./ai.js";

const CLAUDE_SONNET = "claude-sonnet-4-6";
const CLAUDE_OPUS = "claude-opus-4-6";
const OPENAI_DEFAULT = "gpt-4o";

export async function callAI(
  system: string,
  user: string,
  config: AiConfig,
  opts: { smart?: boolean } = {}
): Promise<string> {
  if (config.provider === "claude") {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: config.apiKey });

    const messages = [{ role: "user" as const, content: user }];
    const base = { max_tokens: 4096, system, messages };

    const response = await anthropic.messages.create(
      opts.smart
        ? { ...base, model: CLAUDE_OPUS, thinking: { type: "enabled" as const, budget_tokens: 10000 } }
        : { ...base, model: CLAUDE_SONNET }
    );

    type TextContent = Extract<(typeof response.content)[number], { type: "text" }>;
    return response.content
      .filter((b): b is TextContent => b.type === "text")
      .map((b) => b.text)
      .join("");
  }

  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: config.apiKey });

  const response = await openai.chat.completions.create({
    model: OPENAI_DEFAULT,
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
  opts: { smart?: boolean } = {}
): Promise<void> {
  if (config.provider === "claude") {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: config.apiKey });

    const messages = [{ role: "user" as const, content: user }];
    const base = { max_tokens: 4096, system, messages };

    const stream = anthropic.messages.stream(
      opts.smart
        ? { ...base, model: CLAUDE_OPUS, thinking: { type: "enabled" as const, budget_tokens: 10000 } }
        : { ...base, model: CLAUDE_SONNET }
    );

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

  const stream = await openai.chat.completions.create({
    model: OPENAI_DEFAULT,
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
