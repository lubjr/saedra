import { AwsCredentials } from "./types.js";
import { EC2Client } from "@aws-sdk/client-ec2";
import { S3Client } from "@aws-sdk/client-s3";
import { RDSClient } from "@aws-sdk/client-rds";

export function buildClients(credentials: AwsCredentials) {
  const { accessKeyId, secretAccessKey, region } = credentials;

  return {
    ec2: new EC2Client({ credentials: { accessKeyId, secretAccessKey }, region }),
    s3: new S3Client({ credentials: { accessKeyId, secretAccessKey }, region }),
    rds: new RDSClient({ credentials: { accessKeyId, secretAccessKey }, region }),
  };
}