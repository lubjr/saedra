import { broker, connectClient } from '@repo/nats-client/client';
import { IacAnalysisRequest } from '../types/iac.js';

export async function initNats() {
  await connectClient();
  console.log('NATS client connected');
}

export async function publishIacForAnalysis(data: IacAnalysisRequest) {
  const encoder = new TextEncoder();
  const payload = encoder.encode(JSON.stringify(data));
  broker.publish('iac.to.analyze', payload);
}