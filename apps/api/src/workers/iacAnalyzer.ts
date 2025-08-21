import { config } from "dotenv";
import { OpenAI } from "openai";

config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, turbo/no-undeclared-env-vars
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const analyzeWithIA = async (content: string) => {
  const prompt = `
  You are an infrastructure expert. Analyze the IaC file and return a JSON with the following structure:

  {
    "resources": [
      {
        "type": "...",
        "name": "...",
        "description": "...",
        "risks": ["..."],
        "recommendations": ["..."]
      }
    ],
    "summary": "..."
  }

  File:
  \`\`\`
  ${content}
  \`\`\`
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content;
  return raw || "";
};
