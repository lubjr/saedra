"use client";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { FolderIcon, PlusIcon, ZapIcon } from "@repo/ui/lucide";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { EmptyProjects } from "../../../components/EmptyProjects";
import { useProjects } from "../../contexts/ProjectsContext";

const steps = [
  {
    cmd: "npm install -g saedra",
    label: "Install the CLI",
  },
  {
    cmd: "saedra login",
    label: "Authenticate",
  },
  {
    cmd: "saedra init --with-hooks",
    label: "Link your repository and install git hooks",
  },
  {
    cmd: "saedra memory decision add",
    label: "Record your first architecture decision",
  },
  {
    cmd: "saedra memory change log --from-git",
    label: "Log recent changes from git history",
  },
  {
    cmd: "saedra review",
    label: "Run your first architectural review",
  },
];

const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Page() {
  React.useEffect(() => {
    toast.dismiss("login");
  }, []);

  const { projects, isLoading } = useProjects();

  const projectsList = Array.isArray(projects)
    ? projects
    : projects
      ? [projects]
      : [];

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="w-full max-w-2xl space-y-4 p-4">
          <Skeleton className="w-full" style={{ height: "128px" }} />
          <Skeleton className="w-full" style={{ height: "128px" }} />
          <Skeleton className="w-full" style={{ height: "128px" }} />
        </div>
      </div>
    );
  }

  if (projectsList.length === 0) {
    return <EmptyProjects />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Home</h1>
        <p className="text-sm text-muted-foreground">
          Your projects and setup guide.
        </p>
      </div>

      {/* Project cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Projects
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/new-project">
              <PlusIcon className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projectsList.map((project) => {
            return (
              <Link
                key={project.id}
                href={`/dashboard/project/${project.id}`}
                className="block"
              >
                <Card className="bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer h-full py-0">
                  <CardContent className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-teal-500/10 p-2 rounded-md shrink-0">
                        <FolderIcon className="h-4 w-4 text-teal-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Created {formatDate(project.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Getting started guide */}
      <Card className="bg-zinc-900 border-teal-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ZapIcon className="h-5 w-5 text-teal-400" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Run these commands inside your repository to start tracking
            architectural context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {steps.map((step, i) => {
              return (
                <li key={step.cmd} className="flex items-start gap-3">
                  <span className="text-xs font-mono text-muted-foreground mt-1.5 w-4 shrink-0 text-right">
                    {i + 1}.
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs text-muted-foreground">
                      {step.label}
                    </p>
                    <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-2 py-1 rounded block">
                      {step.cmd}
                    </code>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
