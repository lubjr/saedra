import { DescribeDBInstancesCommand, RDSClient } from "@aws-sdk/client-rds";
import { AwsResource } from "../types.js";

export async function listDatabases(client: RDSClient, region: string): Promise<AwsResource[]> {
  const data = await client.send(new DescribeDBInstancesCommand({}));

  return (data.DBInstances || []).map(db => ({
    id: db.DBInstanceIdentifier || "unknown",
    type: "RDS",
    name: db.DBName || db.DBInstanceIdentifier || "Unnamed RDS",
    region,
  }));
}