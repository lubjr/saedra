"use client";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { KeyIcon, MapPinIcon, ShieldIcon } from "@repo/ui/lucide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import * as React from "react";
import { toast } from "sonner";

import { connectAWS } from "../../../../auth/credentials";
import { useProjects } from "../../../contexts/ProjectsContext";

export default function SettingsPage() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");
  const [accessKey, setAccessKey] = React.useState("");
  const [secretKey, setSecretKey] = React.useState("");
  const [region, setRegion] = React.useState("us-east-1");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    setIsLoading(true);

    try {
      const result = await connectAWS({
        projectId: selectedProjectId,
        awsConfig: {
          accessKey,
          secretKey,
          region,
        },
      });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("Credentials saved successfully!");
    } catch (error) {
      toast.error("Failed to save credentials");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const regions = [
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
    "eu-west-1",
    "eu-central-1",
    "ap-southeast-1",
    "ap-northeast-1",
    "sa-east-1",
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mx-auto max-w-2xl w-full space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your AWS credentials for integration
          </p>
        </div>

        <Card className="bg-zinc-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldIcon className="h-4 w-4" />
              AWS credentials
            </CardTitle>
            <CardDescription className="text-xs">
              Enter your AWS credentials to enable integration with the services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="project" className="text-sm">
                Select Project
              </Label>
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800">
                  {projects && projects.length > 0 ? (
                    projects.map((project) => {
                      return (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="no-projects" disabled>
                      No projects available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="access-key" className="flex items-center gap-2 text-sm">
                <KeyIcon className="h-3 w-3" />
                AWS Access Key ID
              </Label>
              <Input
                id="access-key"
                type="text"
                placeholder="AKIAIOSFODNN7EXAMPLE"
                value={accessKey}
                onChange={(e) => {
                  return setAccessKey(e.target.value);
                }}
                className="font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="secret-key" className="flex items-center gap-2 text-sm">
                <ShieldIcon className="h-3 w-3" />
                AWS Secret Access Key
              </Label>
              <Input
                id="secret-key"
                type="password"
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                value={secretKey}
                onChange={(e) => {
                  return setSecretKey(e.target.value);
                }}
                className="font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="region" className="flex items-center gap-2 text-sm">
                <MapPinIcon className="h-3 w-3" />
                AWS Region
              </Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800">
                  {regions.map((r) => {
                    return (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                onClick={handleSave}
                disabled={
                  !selectedProjectId || !accessKey || !secretKey || isLoading
                }
                className="flex-1"
              >
                {isLoading ? "Saving..." : "Save Credentials"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium">
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Credentials are stored securely</p>
            <p>• Use IAM credentials with limited permissions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
