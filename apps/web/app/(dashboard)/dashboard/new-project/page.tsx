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
import { FolderIcon, SparklesIcon } from "@repo/ui/lucide";
import * as React from "react";
import { toast } from "sonner";

import { useProjects } from "../../../contexts/ProjectsContext";

export default function Page() {
  const { create } = useProjects();
  const [name, setName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setIsLoading(true);

    try {
      await create({ name });
      toast.success("Project created successfully!");
      setName("");
    } catch (error) {
      toast.error("Failed to create project");
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">
          Create project
        </h1>
        <p className="text-muted-foreground">
          Create a new project to organize your AWS infrastructure and resources
        </p>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            New Project
          </CardTitle>
          <CardDescription>
            Give your project a descriptive name to help you identify it later
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4" />
              Project Name
            </Label>
            <Input
              id="project-name"
              type="text"
              placeholder="My Awesome Project"
              value={name}
              onChange={(e) => {
                return setName(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Choose a unique and memorable name for your project
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={handleSubmit} disabled={!name.trim() || isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
