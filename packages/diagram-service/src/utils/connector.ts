
import { DiagramEdge } from "../types.js";
import { type AwsResource } from "@repo/aws-connector/aws"

export function buildEdges(resources: AwsResource[]): DiagramEdge[] {
  const edges: DiagramEdge[] = [];

  const ec2Instances = resources.filter(r => r.type === "EC2");
  const s3Buckets = resources.filter(r => r.type === "S3");
  const rdsInstances = resources.filter(r => r.type === "RDS");

  ec2Instances.forEach(ec2 => {
    s3Buckets.forEach(s3 => {
      edges.push({ from: ec2.id, to: s3.id, relation: "reads/writes" });
    });
    rdsInstances.forEach(rds => {
      edges.push({ from: ec2.id, to: rds.id, relation: "connects-to" });
    });
  });

  return edges;
}