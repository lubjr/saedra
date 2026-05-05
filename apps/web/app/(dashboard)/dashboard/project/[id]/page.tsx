"use client";

import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  CheckCircle2Icon,
  ClockIcon,
  CodeIcon,
  ShieldIcon,
  SparklesIcon,
  ZapIcon,
} from "@repo/ui/lucide";
import * as React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const severityColor: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function Page({ params }: PageProps) {
  React.use(params);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">
          Project Overview
        </h1>
        <p className="text-muted-foreground">
          Architectural context, decisions and recent changes for this project.
        </p>
      </div>

      {/* Architecture State */}
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            Architecture State
          </CardTitle>
          <CardDescription>
            Current summary and core principles of the project architecture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No architecture state found. Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra memory state update --ai
            </code>{" "}
            to generate the initial state from your codebase.
          </p>
        </CardContent>
      </Card>

      {/* Active Decisions */}
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2Icon className="h-5 w-5" />
            Active Decisions
          </CardTitle>
          <CardDescription>
            Architecture decisions recorded for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No decisions found. Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra memory decision add
            </code>{" "}
            to record your first architecture decision.
          </p>
        </CardContent>
      </Card>

      {/* Violation Rules */}
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Violation Rules
          </CardTitle>
          <CardDescription>Rules enforced on every PR review.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {([] as { label: string; severity: string }[]).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No rules found. Rules are created automatically from your
                decisions when you run{" "}
                <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                  saedra review
                </code>
                .
              </p>
            )}
            {([] as { label: string; severity: string }[]).map((rule) => {
              return (
                <Badge
                  key={rule.label}
                  variant="outline"
                  className={severityColor[rule.severity]}
                >
                  {rule.label}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Changes */}
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            Recent Changes
          </CardTitle>
          <CardDescription>
            Last change events logged for this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No changes found. Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra memory change log --from-git
            </code>{" "}
            to log changes from your git history.
          </p>
        </CardContent>
      </Card>

      {/* CLI hint */}
      <Card className="bg-zinc-900 border-teal-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CodeIcon className="h-5 w-5 text-teal-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Get started with the CLI
              </p>
              <p className="text-sm text-muted-foreground">
                Install the Saedra CLI and run{" "}
                <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                  saedra init
                </code>{" "}
                inside your repository to start tracking architectural context.
              </p>
            </div>
            <ZapIcon className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
