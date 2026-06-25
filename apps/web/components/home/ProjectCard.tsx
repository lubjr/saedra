import { Card } from "@repo/ui/card";
import {
  ArchiveIcon,
  ArrowUpRightIcon,
  ClockIcon,
  FolderIcon,
  GitBranchIcon,
} from "@repo/ui/lucide";
import Link from "next/link";

import type { ProjectSummary } from "../../auth/projects";

interface Project {
  id: string;
  name: string;
  created_at: string;
  has_memory: boolean;
}

interface Props {
  project: Project;
  summary?: ProjectSummary;
  timestamps?: "relative" | "exact";
}

const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const formatExactDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const healthColor = (h: number) => {
  if (h >= 85) return "text-brand";
  if (h >= 70) return "text-status-warning";
  return "text-status-error";
};

const healthDot = (h: number) => {
  if (h >= 85) return "bg-brand";
  if (h >= 70) return "bg-status-warning";
  return "bg-status-error";
};

export const ProjectCard = ({
  project,
  summary,
  timestamps = "relative",
}: Props) => {
  const isArchived = summary?.status === "archived";
  const isSetup = summary?.status === "setup";
  const lastActive = summary?.last_activity_at ?? project.created_at;

  return (
    <Link href={`/dashboard/project/${project.id}`} className="block">
      <Card
        className={`bg-card border border-border hover:bg-muted/60 hover:border-border-emphasis hover:-translate-y-px transition rounded-xl cursor-pointer h-full p-0 py-0 gap-0 shadow-none ${isArchived ? "opacity-60" : ""} ${isSetup ? "border-dashed border-border-emphasis" : ""}`}
      >
        <div className="p-[18px] flex flex-col gap-3.5 h-full">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="size-7 rounded-md bg-brand-fill text-brand grid place-items-center shrink-0">
              <FolderIcon className="size-4" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {isArchived && (
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border-emphasis">
                  <ArchiveIcon className="size-3" /> Archived
                </span>
              )}
              {isSetup && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-fill text-brand border border-brand-stroke">
                  Setup pending
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1">
            <p className="text-[15px] font-semibold tracking-tight mb-1.5">
              {project.name}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-mono">
              {summary?.last_review_branch && (
                <span className="flex items-center gap-1">
                  <GitBranchIcon className="size-3" />
                  {summary.last_review_branch}
                </span>
              )}
              <span className="flex items-center gap-1">
                <ClockIcon className="size-3" />
                {timestamps === "exact"
                  ? formatExactDate(lastActive)
                  : formatRelativeDate(lastActive)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            {isSetup ? (
              <span className="flex items-center gap-1 text-[11px] text-brand font-mono">
                Run{" "}
                <code className="bg-brand-fill px-1 rounded">saedra init</code>{" "}
                to start
                <ArrowUpRightIcon className="size-3 shrink-0" />
              </span>
            ) : summary?.health != null ? (
              <span
                className={`flex items-center gap-1.5 text-[11px] font-mono ${healthColor(summary.health)}`}
              >
                <span
                  className={`size-1.5 rounded-full ${healthDot(summary.health)}`}
                />
                {summary.health}
                {summary.health_delta !== 0 && (
                  <em
                    className={`not-italic text-[10px] px-1 rounded ${summary.health_delta > 0 ? "bg-brand-fill text-brand" : "bg-status-error-fill text-status-error"}`}
                  >
                    {summary.health_delta > 0 ? "+" : ""}
                    {summary.health_delta}
                  </em>
                )}
                <span className="text-muted-foreground">health</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                no review yet
                <span className="text-muted-foreground/40">health</span>
              </span>
            )}
            {!isSetup &&
              summary?.decisions_count != null &&
              summary.decisions_count > 0 && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  <span className="text-foreground">
                    {summary.decisions_count}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {summary.decisions_count === 1 ? "decision" : "decisions"}
                  </span>
                </span>
              )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
