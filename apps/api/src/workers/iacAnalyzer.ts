import { broker, codec, connectClient } from '@repo/nats-client/client';
import { IacAnalysisRequest } from '../types/iac.js';
import { OpenAI } from 'openai';
import { config } from 'dotenv';

config();

// eslint-disable-next-line turbo/no-undeclared-env-vars
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

async function analyzeWithIA(content: string, filename: string) {
  const prompt = `
Você é um especialista em infraestrutura. Analise o seguinte arquivo IaC (${filename}) e retorne um JSON com a seguinte estrutura:

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
    model: 'gpt-4.1-nano',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content;
  return raw || '';
}

export async function startWorker() {
  await connectClient();

  const sub = broker.subscribe('iac.to.analyze');
  console.log('Worker iacAnalyzer listening...');

  for await (const msg of sub) {
    try {
      const decoded = JSON.parse(codec.decode(msg.data)) as IacAnalysisRequest;
      const response = await analyzeWithIA(decoded.content, decoded.filename);

      const result = {
        filename: decoded.filename,
        analysis: JSON.parse(response)
      };

      console.log('Resultado:', result.analysis);

      broker.publish('iac.analysis.result', codec.encode(JSON.stringify(result)));
      console.log(`Análise publicada para ${decoded.filename}`);
    } catch (err) {
      console.error('Erro no worker:', err);
    }
  }
}