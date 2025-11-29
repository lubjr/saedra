import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

import { getDiagram } from "../../../../../auth/diagram";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const result = (await getDiagram({ projectId: id })) as any;

  const nodes = result.data?.graph?.nodes;
  const edges = result.data?.graph?.edges;

  return (
    <div className="flex flex-col">
      <div className="mx-auto max-w-6xl w-full space-y-6 px-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">Diagram</h1>
          <p className="text-muted-foreground">
            Your project's infrastructure diagram and resource overview
          </p>
        </div>

        {!result ? (
          <div>
            <p>No credentials registered for this project</p>
          </div>
        ) : "error" in result ? (
          <div>
            <p>No credentials registered for this project</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-zinc-900">
                <CardHeader className="pb-3">
                  <CardDescription>Total Resources</CardDescription>
                  <CardTitle className="text-3xl">{nodes.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-zinc-900">
                <CardHeader className="pb-3">
                  <CardDescription>Connections</CardDescription>
                  <CardTitle className="text-3xl">{edges.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-zinc-900">
                <CardHeader className="pb-3">
                  <CardDescription>Resource Types</CardDescription>
                  <CardTitle className="text-3xl">
                    {
                      new Set(
                        nodes.map((n: any) => {
                          return n.type;
                        }),
                      ).size
                    }
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Diagram Visualization */}
            <Card className="bg-zinc-900">
              <CardHeader>
                <CardTitle>Architecture Resources</CardTitle>
                <CardDescription>
                  Infrastructure components and their connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-3">
                  {nodes.map((node: any) => {
                    const connectedEdges = edges.filter((edge: any) => {
                      return edge.source === node.id || edge.target === node.id;
                    });

                    return (
                      <div
                        key={node.id}
                        className={`group relative rounded-lg border p-4 transition-all hover:shadow-md`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <Badge
                              variant="default"
                              className="font-mono text-xs mb-1"
                            >
                              {node.type}
                            </Badge>
                            {connectedEdges.length > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {connectedEdges.length} connection
                                {connectedEdges.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="font-medium leading-tight text-balance">
                              {node.label}
                            </p>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              {node.id}
                            </p>
                          </div>

                          {connectedEdges.length > 0 && (
                            <div className="space-y-1 border-t pt-3">
                              <p className="text-xs font-medium text-muted-foreground">
                                Connected to:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {connectedEdges.map((edge: any, idx: any) => {
                                  const targetId =
                                    edge.source === node.id
                                      ? edge.target
                                      : edge.source;
                                  const targetNode = nodes.find((n: any) => {
                                    return n.id === targetId;
                                  });
                                  return (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {targetNode?.type || targetId}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
