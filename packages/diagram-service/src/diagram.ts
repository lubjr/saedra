import { DiagramGraph, DiagramNode } from "./types.js";
import { type AwsResource } from "@repo/aws-connector/aws"
import { buildEdges } from "./utils/connector.js";

export class DiagramService {
  generateGraph(resources: AwsResource[]): DiagramGraph {
    if (!resources || resources.length === 0) {
      return { nodes: [], edges: [] };
    }

    const nodes: DiagramNode[] = resources.map(res => ({
      id: res.id,
      label: `${res.type} ${res.name}`,
      type: res.type,
    }));

    const edges = buildEdges(resources);

    return { nodes, edges };
  }
}