import { connect, NatsConnection, StringCodec } from 'nats';

let broker: NatsConnection;
const codec = StringCodec();

export async function connectClient() {
  if (!broker) broker = await connect({ servers: 'localhost:4222' });
  return broker;
}

export { codec, broker };