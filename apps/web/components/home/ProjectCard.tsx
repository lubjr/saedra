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

const healthColor = (h: number) => {
  if (h >= 85) return "text-teal-400";
  if (h >= 70) return "text-yellow-400";
  return "text-red-400";
};

const healthDot = (h: number) => {
  if (h >= 85) return "bg-teal-400";
  if (h >= 70) return "bg-yellow-400";
  return "bg-red-400";
};

export const ProjectCard = ({ project, summary }: Props) => {
  const isArchived = summary?.status === "archived";
  const isSetup = summary?.status === "setup";
  const lastActive = summary?.last_activity_at ?? project.created_at;

  return (
    <Link href={`/dashboard/project/${project.id}`} className="block">
      <Card
        className={`bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700 hover:-translate-y-px transition rounded-xl cursor-pointer h-full p-0 py-0 gap-0 shadow-none ${isArchived ? "opacity-60" : ""} ${isSetup ? "border-dashed border-zinc-700" : ""}`}
      >
        <div className="p-[18px] flex flex-col gap-3.5 h-full">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="size-7 rounded-md bg-teal-500/10 text-teal-400 grid place-items-center shrink-0">
              <FolderIcon className="size-4" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {isArchived && (
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  <ArchiveIcon className="size-3" /> Archived
                </span>
              )}
              {isSetup && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
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
                {formatRelativeDate(lastActive)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            {isSetup ? (
              <span className="flex items-center gap-1 text-[11px] text-teal-400 font-mono">
                Run{" "}
                <code className="bg-teal-500/10 px-1 rounded">saedra init</code>{" "}
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
                    className={`not-italic text-[10px] px-1 rounded ${summary.health_delta > 0 ? "bg-teal-500/10 text-teal-400" : "bg-red-500/10 text-red-400"}`}
                  >
                    {summary.health_delta > 0 ? "+" : ""}
                    {summary.health_delta}
                  </em>
                )}
                <span className="text-zinc-600">health</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <span className="size-1.5 rounded-full bg-zinc-700" />
                no review yet
                <span className="text-zinc-700">health</span>
              </span>
            )}
            {!isSetup &&
              summary?.decisions_count != null &&
              summary.decisions_count > 0 && (
                <span className="text-[11px] font-mono text-muted-foreground">
                  <span className="text-foreground">
                    {summary.decisions_count}
                  </span>{" "}
                  <span className="text-zinc-600">{summary.decisions_count === 1 ? "decision" : "decisions"}</span>
                </span>
              )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
