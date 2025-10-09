import { DiagramService } from "./diagram.js";
import { type AwsResource } from "@repo/aws-connector/aws"

const diagramService = new DiagramService();

export function generateDiagramFromResources(resources: AwsResource[]) {
  return diagramService.generateGraph(resources);
}

export * from "./types.js";