"use client";

import { Button } from "@repo/ui/button";
import { CopyIcon, GitBranchIcon, SparklesIcon } from "@repo/ui/lucide";
import { toast } from "sonner";

import type { ProjectSummary } from "../../auth/projects";

interface Props {
  projectName: string;
  summary: ProjectSummary | null;
}

const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

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

export const OverviewHeader = ({ projectName, summary }: Props) => {
  const handleCopyCli = () => {
    void navigator.clipboard.writeText("saedra review");
    toast.success("Copied to clipboard");
  };

  const handleRunReview = () => {
    toast.info("Run 'saedra review' in your terminal to start a new review.");
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          Project overview
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Project state, decisions, and recent activity at a glance.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {summary && <StatusChip status={summary.status} />}
          {summary?.last_review_branch && (
            <span className="flex items-center gap-1 rounded-full bg-background border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
              <GitBranchIcon className="size-3" />
              {summary.last_review_branch}
            </span>
          )}
          {summary?.last_review_at && (
            <span className="rounded-full bg-background border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
              {formatRelativeDate(summary.last_review_at)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-1">
        <Button variant="outline" size="sm" onClick={handleCopyCli}>
          <CopyIcon className="size-3.5" /> Copy command
        </Button>
        <Button variant="brand" size="sm" onClick={handleRunReview}>
          <SparklesIcon className="size-4" /> Run review
        </Button>
      </div>
    </div>
  );
};
