"use client";

import { Button } from "@repo/ui/button";
import { DownloadIcon, GitBranchIcon } from "@repo/ui/lucide";

import type { ProjectSummary } from "../../../auth/projects";

type Range = "7d" | "30d" | "90d" | "all";

interface Props {
  projectName: string;
  summary: ProjectSummary | null;
  range: Range;
  onRangeChange: (r: Range) => void;
  onExport: () => void;
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

const RANGES: Range[] = ["7d", "30d", "90d", "all"];

export const MetricsHeader = ({
  projectName,
  summary,
  range,
  onRangeChange,
  onExport,
}: Props) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-400">
          Project metrics
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Metrics</h1>
        <p className="text-sm text-zinc-400">
          Architectural health & evolution over time.
        </p>
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {summary && <StatusChip status={summary.status} />}
          {summary?.last_review_branch && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
              <GitBranchIcon className="size-3" />
              {summary.last_review_branch}
            </span>
          )}
          {summary?.last_review_at && (
            <span className="rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-500">
              last review · {formatRelativeDate(summary.last_review_at)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-1">
        <div className="flex items-center rounded-md border border-zinc-800 bg-zinc-950 p-0.5 font-mono text-[11px]">
          {RANGES.map((r) => {
            return (
              <button
                key={r}
                onClick={() => {
                  return onRangeChange(r);
                }}
                className={`px-2 py-1 rounded-md transition-colors ${range === r ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {r}
              </button>
            );
          })}
        </div>
        <Button variant="outline" size="sm" onClick={onExport}>
          <DownloadIcon className="size-3.5" /> Export
        </Button>
      </div>
    </div>
  );
};
