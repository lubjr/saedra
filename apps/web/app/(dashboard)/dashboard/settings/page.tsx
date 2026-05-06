"use client";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { MapPinIcon, SparklesIcon, ZapIcon } from "@repo/ui/lucide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import * as React from "react";
import { toast } from "sonner";

import { useProjects } from "../../../contexts/ProjectsContext";

export default function SettingsPage() {
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");
  const [region, setRegion] = React.useState("us-east-1");
  const [model, setModel] = React.useState("claude-sonnet-4-5");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => {
      return setTimeout(resolve, 500);
    });
    setIsLoading(false);
    toast.success("Settings saved!");
  };

  const regions = [
    "us-east-1",
    "us-east-2",
    "us-west-2",
    "eu-west-1",
    "eu-central-1",
    "ap-southeast-1",
    "ap-northeast-1",
  ];

  const models = [
    { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
    { value: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
    { value: "claude-opus-4", label: "Claude Opus 4" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure the AI provider and preferences for your projects.
        </p>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            AI Provider
          </CardTitle>
          <CardDescription>
            Configure the AI model used for code review and context generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-md">
            <label htmlFor="project" className="text-sm font-medium">
              Project
            </label>
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
              Select the project to configure.
            </p>
          </div>

          <div className="space-y-2 max-w-md">
            <label
              htmlFor="model"
              className="text-sm font-medium flex items-center gap-2"
            >
              <ZapIcon className="h-4 w-4" />
              Model
            </label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800">
                {models.map((m) => {
                  return (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Model used for review and context generation via Amazon Bedrock.
            </p>
          </div>

          <div className="space-y-2 max-w-md">
            <label
              htmlFor="region"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MapPinIcon className="h-4 w-4" />
              Bedrock Region
            </label>
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
              AWS region where your Bedrock endpoint is configured.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={!selectedProjectId || isLoading}
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
