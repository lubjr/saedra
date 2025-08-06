import { broker, codec, connectClient } from "@repo/nats-client/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resultStore = new Map<string, any>();

export const startResultListener = async () => {
  await connectClient();

  const sub = broker.subscribe("iac.analysis.result");

  // eslint-disable-next-line no-console
  console.log("Escutando iac.analysis.result...");

  for await (const msg of sub) {
    try {
      const decoded = JSON.parse(codec.decode(msg.data));
      const { filename, analysis } = decoded;
      resultStore.set(filename, analysis);
      // eslint-disable-next-line no-console
      console.log(`Resultado armazenado para ${filename}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Erro ao processar resultado da análise:", error);
    }
  }
};
