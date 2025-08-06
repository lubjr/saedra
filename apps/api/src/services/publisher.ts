import { broker, connectClient } from "@repo/nats-client/client";

import { IacAnalysisRequest } from "../types/iac.js";

export const initNats = async () => {
  await connectClient();
  // eslint-disable-next-line no-console
  console.log("NATS client connected");
};

export const publishIacForAnalysis = async (data: IacAnalysisRequest) => {
  const encoder = new TextEncoder();
  const payload = encoder.encode(JSON.stringify(data));
  broker.publish("iac.to.analyze", payload);
};
