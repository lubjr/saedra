import { broker, codec, connectClient } from "@repo/nats-client/client";

import { IacAnalysisRequest } from "../types/iac.js";
import { analyzeWithIA } from "./iacAnalyzer.js";

export const startWorker = async () => {
  await connectClient();

  const sub = broker.subscribe("iac.to.analyze");

  for await (const msg of sub) {
    try {
      const decoded = JSON.parse(
        codec.decode(msg.data),
      ) as IacAnalysisRequest & { replyTopic: string };
      const { content, replyTopic } = decoded;

      const response = await analyzeWithIA(content);

      const result = {
        analysis: JSON.parse(response),
      };

      broker.publish(replyTopic, codec.encode(JSON.stringify(result)));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Analysis error:", error);

      try {
        const decoded = JSON.parse(codec.decode(msg.data)) as {
          replyTopic?: string;
        };
        if (decoded?.replyTopic) {
          broker.publish(
            decoded.replyTopic,
            codec.encode(JSON.stringify({ error: (error as Error).message })),
          );
        }
      } catch {
        // if even the replyTopic cannot be read, just log in
      }
    }
  }
};
