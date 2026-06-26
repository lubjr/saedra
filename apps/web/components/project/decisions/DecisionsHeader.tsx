"use client";

import { Button } from "@repo/ui/button";
import { CopyIcon, GitBranchIcon, PlusIcon } from "@repo/ui/lucide";
import { toast } from "sonner";

import type { ProjectSummary } from "../../../auth/projects";
import { formatRelativeDate } from "./helpers";

const RECORD_CMD = "saedra memory decision add";

const StatusChip = ({ status }: { status: ProjectSummary["status"] }) => {
  const isPulse = status === "active";
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-background border border-border px-2.5 py-0.5 font-mono text-xs text-foreground/80">
      <span className="relative flex size-1.5">
        <span
          className={`size-1.5 rounded-full ${status === "active" ? "bg-brand" : status === "archived" ? "bg-muted-foreground" : "bg-status-warning"}`}
        />
        {isPulse && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-50" />
        )}
      </span>
      {status}
    </span>
  );
};

interface Props {
  summary: ProjectSummary | null;
}

export const DecisionsHeader = ({ summary }: Props) => {
  const handleCopy = () => {
    void navigator.clipboard.writeText(RECORD_CMD);
    toast.success("Copied to clipboard");
  };

  const handleRun = () => {
    toast.info(
      `Run '${RECORD_CMD}' in your terminal to record a new decision.`,
    );
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          Project decisions
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Decisions</h1>
        <p className="text-sm text-muted-foreground">
          Architectural decisions recorded by the CLI.
        </p>
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {summary ? (
            <>
              <StatusChip status={summary.status} />
              {summary.last_review_branch && (
                <span className="flex items-center gap-1 rounded-full bg-background border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                  <GitBranchIcon className="size-3" />
                  {summary.last_review_branch}
                </span>
              )}
              {summary.last_activity_at && (
                <span className="rounded-full bg-background border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                  last · {formatRelativeDate(summary.last_activity_at)}
                </span>
              )}
            </>
          ) : (
            <span className="rounded-full bg-background border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
              no decisions yet
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-1">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <CopyIcon className="size-3.5" /> Copy command
        </Button>
        <Button variant="brand" size="sm" onClick={handleRun}>
          <PlusIcon className="size-3.5" /> Record decision
        </Button>
      </div>
    </div>
  );
};
