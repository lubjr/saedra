import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AwsResource } from "../types.js";

export async function listBuckets(client: S3Client, region: string): Promise<AwsResource[]> {
  const data = await client.send(new ListBucketsCommand({}));

  return (data.Buckets || []).map(bucket => ({
    id: bucket.Name || "unknown",
    type: "S3",
    name: bucket.Name || "Unnamed S3",
    region,
  }));
}