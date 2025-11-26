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
    <div className="flex flex-col">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">Settings</h1>
          <p className="text-muted-foreground">
            Connect your AWS account to integrate with cloud services
          </p>
        </div>

        <Card className="mt-4 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              AWS credentials
            </CardTitle>
            <CardDescription>
              Enter your AWS credentials to enable integration with the services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="project" className="flex items-center gap-2">
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
              <p className="text-xs text-muted-foreground">
                Select the project to connect with AWS
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-key" className="flex items-center gap-2">
                <KeyIcon className="h-4 w-4" />
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
              <p className="text-xs text-muted-foreground">
                Your AWS public access key
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret-key" className="flex items-center gap-2">
                <ShieldIcon className="h-4 w-4" />
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
              <p className="text-xs text-muted-foreground">
                Your private AWS key
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
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
              <p className="text-xs text-muted-foreground">
                Select the region where your resources are hosted
              </p>
            </div>

            <div className="pt-4 flex gap-3">
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
      </div>
    </div>
  );
}
