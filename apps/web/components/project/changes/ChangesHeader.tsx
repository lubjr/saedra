"use client";

import { Button } from "@repo/ui/button";
import { CopyIcon, GitBranchIcon, PlusIcon } from "@repo/ui/lucide";
import { toast } from "sonner";

import type { ProjectSummary } from "../../../auth/projects";
import { formatRelativeDate } from "../decisions/helpers";

const RECORD_CMD = "saedra memory change log --from-git";

const StatusChip = ({ status }: { status: ProjectSummary["status"] }) => {
  const isPulse = status === "active";
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-300">
      <span className="relative flex size-1.5">
        <span
          className={`size-1.5 rounded-full ${status === "active" ? "bg-teal-400" : status === "archived" ? "bg-zinc-500" : "bg-yellow-400"}`}
        />
        {isPulse && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-50" />
        )}
      </span>
      {status}
    </span>
  );
};

interface Props {
  summary: ProjectSummary | null;
}

export const ChangesHeader = ({ summary }: Props) => {
  const handleCopy = () => {
    void navigator.clipboard.writeText(RECORD_CMD);
    toast.success("Copied to clipboard");
  };

  const handleRun = () => {
    toast.info(`Run '${RECORD_CMD}' in your terminal to log a new change.`);
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-400">
          Project changes
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Changes</h1>
        <p className="text-sm text-zinc-400">
          Architectural change events recorded by the CLI.
        </p>
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {summary ? (
            <>
              <StatusChip status={summary.status} />
              {summary.last_review_branch && (
                <span className="flex items-center gap-1 rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
                  <GitBranchIcon className="size-3" />
                  {summary.last_review_branch}
                </span>
              )}
              {summary.last_activity_at && (
                <span className="rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-500">
                  last · {formatRelativeDate(summary.last_activity_at)}
                </span>
              )}
            </>
          ) : (
            <span className="rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-500">
              no changes yet
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-1">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <CopyIcon className="size-3.5" /> Copy command
        </Button>
        <Button variant="brand" size="sm" onClick={handleRun}>
          <PlusIcon className="size-3.5" /> Log change
        </Button>
      </div>
    </div>
  );
};
