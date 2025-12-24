/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Label } from "@repo/ui/label";
import { KeyIcon, SparklesIcon } from "@repo/ui/lucide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import * as React from "react";
import { toast } from "sonner";

import { getProjectCredentials } from "../../../../../auth/credentials";
import { generateDiagram } from "../../../../../auth/diagram";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const { id } = React.use(params);
  const [credentials, setCredentials] = React.useState<any[]>([]);
  const [selectedCredentialId, setSelectedCredentialId] =
    React.useState<string>("");
  const [diagram, setDiagram] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const fetchCredentials = async () => {
      const result = await getProjectCredentials({ projectId: id });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      if (result.data && Array.isArray(result.data)) {
        setCredentials(result.data);
        if (result.data.length > 0) {
          setSelectedCredentialId(result.data[0].id);
        }
      }
    };

    fetchCredentials();
  }, [id]);

  const handleGenerateDiagram = async () => {
    if (!selectedCredentialId) {
      toast.error("Please select a credential");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await generateDiagram({
        projectId: id,
        credentialId: selectedCredentialId,
      });

      if (!result) {
        toast.error("Failed to generate diagram");
        return;
      }

      if ("error" in result) {
        toast.error(result.error);
        setError(result.error);
        return;
      }

      setDiagram(result.data);
      toast.success("Diagram generated successfully!");
    } catch (error) {
      toast.error("Failed to generate diagram");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nodes = diagram?.graph?.nodes || [];
  const edges = diagram?.graph?.edges || [];

  return (
    <div className="flex flex-col">
      <div className="mx-auto max-w-6xl w-full space-y-6 px-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">
            Project Diagram
          </h1>
          <p className="text-muted-foreground">
            Your project&apos;s infrastructure diagram and resource overview
          </p>
        </div>

        {/* Credential Selection */}
        <Card className="bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              Generate Diagram
            </CardTitle>
            <CardDescription>
              Select a credential and generate your infrastructure diagram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {credentials.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No credentials registered for this project. Please add AWS
                credentials first.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="credential" className="flex items-center gap-2">
                    <KeyIcon className="h-4 w-4" />
                    Select Credential
                  </Label>
                  <Select
                    value={selectedCredentialId}
                    onValueChange={setSelectedCredentialId}
                  >
                    <SelectTrigger id="credential">
                      <SelectValue placeholder="Select a credential" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800">
                      {credentials.map((cred: any) => {
                        return (
                          <SelectItem key={cred.id} value={cred.id}>
                            {cred.access_key_id?.slice(0, 4) ?? "N/A"}*****
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the AWS credential to use for generating the diagram
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    onClick={handleGenerateDiagram}
                    disabled={loading || !selectedCredentialId}
                    className="flex-1"
                  >
                    {loading ? "Generating..." : "Generate Diagram"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Diagram Display */}
        {diagram && (
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
