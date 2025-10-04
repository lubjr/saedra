import { AwsResource } from "../types.js";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

export async function listInstances(client: EC2Client, region: string): Promise<AwsResource[]> {
  const data = await client.send(new DescribeInstancesCommand({}));
  
  const resources: AwsResource[] = [];

  data.Reservations?.forEach(res => {
    res.Instances?.forEach(instance => {
      resources.push({
        id: instance.InstanceId ?? "unknown",
        type: "EC2",
        name: instance.Tags?.find(t => t.Key === "Name")?.Value ?? "Unnamed EC2",
        region,
      });
    });
  });

  return resources;
}