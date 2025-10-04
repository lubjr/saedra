import { AwsCredentials, AwsResource } from "./types.js";
import { buildClients } from "./clients.js";
import { listInstances } from "./services/ec2.js";
import { listBuckets } from "./services/s3.js";
import { listDatabases } from "./services/rds.js";

export async function collectResources(credentials: AwsCredentials): Promise<{ resources: AwsResource[] }> {
  const clients = buildClients(credentials);
  const region = credentials.region;

  const [ec2, s3, rds] = await Promise.all([
    listInstances(clients.ec2, region),
    listBuckets(clients.s3, region),
    listDatabases(clients.rds, region),
  ]);

  return { resources: [...ec2, ...s3, ...rds] };
}