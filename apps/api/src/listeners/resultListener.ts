import { broker, codec, connectClient } from '@repo/nats-client/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resultStore = new Map<string, any>();

export async function startResultListener() {
  await connectClient();

  const sub = broker.subscribe('iac.analysis.result');

  console.log('🔎 Escutando iac.analysis.result...');

  for await (const msg of sub) {
    try {
      const decoded = JSON.parse(codec.decode(msg.data));
      const { filename, analysis } = decoded;
      resultStore.set(filename, analysis);
      console.log(`Resultado armazenado para ${filename}`);
    } catch (err) {
      console.error('Erro ao processar resultado da análise:', err);
    }
  }
}