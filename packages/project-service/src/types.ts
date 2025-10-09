import { type AwsCredentials } from "@repo/aws-connector/aws";

export type Project = {
    id: string;
    name: string;
    userId: string;
    awsConfig?: AwsCredentials;
}