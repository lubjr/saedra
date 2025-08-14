import { config } from "dotenv";
import { OpenAI } from "openai";

config();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, turbo/no-undeclared-env-vars
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const analyzeWithIA = async (content: string) => {
  const prompt = `
  Você é um especialista em infraestrutura. Analise o arquivo IaC e retorne um JSON com a seguinte estrutura:

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

  Arquivo:
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
