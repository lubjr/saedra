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

import {
  getArchitectureState,
  getDecisions,
  getRecentChanges,
  getViolationRules,
} from "../../../../../auth/documents";

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

const riskColor: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

const statusColor: Record<string, string> = {
  active: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  deprecated: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  superseded: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [architectureState, decisions, rules, changes] = await Promise.all([
    getArchitectureState(id),
    getDecisions(id),
    getViolationRules(id),
    getRecentChanges(id),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">
          Project Overview
        </h1>
        <p className="text-sm text-muted-foreground">
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
          {architectureState ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Version {architectureState.version}
                </p>
                <p className="text-sm">{architectureState.summary}</p>
              </div>
              {architectureState.core_principles.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Core Principles
                  </p>
                  <ul className="space-y-1">
                    {architectureState.core_principles.map((p) => {
                      return (
                        <li key={p} className="text-sm flex gap-2">
                          <span className="text-teal-400 shrink-0">—</span>
                          {p}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {architectureState.constraints.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Constraints
                  </p>
                  <ul className="space-y-1">
                    {architectureState.constraints.map((c) => {
                      return (
                        <li key={c} className="text-sm flex gap-2">
                          <span className="text-yellow-400 shrink-0">—</span>
                          {c}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No architecture state found. Run{" "}
              <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                saedra memory state update --ai
              </code>{" "}
              to generate the initial state from your codebase.
            </p>
          )}
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
          {decisions.length > 0 ? (
            <div className="space-y-3">
              {decisions.map((dec) => {
                return (
                  <div
                    key={dec.id}
                    className="flex items-start justify-between gap-4 py-3 border-b border-zinc-800 last:border-0"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {dec.title}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {dec.id}
                      </p>
                      {dec.affects.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Affects: {dec.affects.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={statusColor[dec.status]}
                      >
                        {dec.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={riskColor[dec.risk_level]}
                      >
                        {dec.risk_level}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No decisions found. Run{" "}
              <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                saedra memory decision add
              </code>{" "}
              to record your first architecture decision.
            </p>
          )}
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
          {rules.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {rules.map((rule) => {
                return (
                  <Badge
                    key={rule.id}
                    variant="outline"
                    className={severityColor[rule.severity]}
                    title={rule.description}
                  >
                    {rule.description.length > 60
                      ? rule.description.slice(0, 57) + "..."
                      : rule.description}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No rules found. Rules are created automatically from your
              decisions when you run{" "}
              <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                saedra review
              </code>
              .
            </p>
          )}
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
          {changes.length > 0 ? (
            <div className="space-y-0">
              {changes.map((chg, i) => {
                return (
                  <div key={chg.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      {i < changes.length - 1 && (
                        <div className="w-px flex-1 bg-zinc-700 mt-1" />
                      )}
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="text-sm font-medium">{chg.summary}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(chg.created_at)}
                      </p>
                      {chg.files_changed.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
                          {chg.files_changed.slice(0, 3).join(", ")}
                          {chg.files_changed.length > 3 &&
                            ` +${chg.files_changed.length - 3} more`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No changes found. Run{" "}
              <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                saedra memory change log --from-git
              </code>{" "}
              to log changes from your git history.
            </p>
          )}
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
