import { connect, NatsConnection, StringCodec, Sub, Msg } from "nats.ws";

let broker: NatsConnection;
const codec = StringCodec();

export async function connectClient() {
  if (!broker) {
    broker = await connect({
      servers: "ws://localhost:9222",
    });
  }
  return broker;
}

export { codec, broker };
export type { Sub, Msg };
