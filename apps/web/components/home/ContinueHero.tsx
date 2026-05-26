"use client";

import { Button } from "@repo/ui/button";
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  GitBranchIcon,
  ShieldIcon,
  SparklesIcon,
} from "@repo/ui/lucide";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import type { Decision } from "../../auth/documents";
import type { ProjectSummary } from "../../auth/projects";
import { MetricsPreview } from "./MetricsPreview";
import { RecentDecisionsPreview } from "./RecentDecisionsPreview";

interface Project {
  id: string;
  name: string;
  created_at: string;
  has_memory: boolean;
}

interface Props {
  project: Project;
  summary?: ProjectSummary;
  decisions?: Decision[];
}

type PreviewMode = "decisions" | "metrics";

const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const lastReviewLabel = (summary: ProjectSummary): string => {
  if (!summary.last_review_at) return "No reviews yet";
  const time = formatRelativeDate(summary.last_review_at);
  const { last_review_violations: v, last_review_warnings: w } = summary;
  const outcome =
    v > 0
      ? `${v} violation${v > 1 ? "s" : ""}`
      : w > 0
        ? `${w} warning${w > 1 ? "s" : ""}`
        : "clean";
  return `${time} · ${outcome}`;
};

export const ContinueHero = ({ project, summary, decisions }: Props) => {
  const [mode, setMode] = React.useState<PreviewMode>("decisions");
  const hasReviews = !!summary?.last_review_at;
  const hasDecisions = !!decisions && decisions.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] rounded-2xl overflow-hidden border border-zinc-800">
      {/* Hero side */}
      <div className="relative bg-zinc-900 p-7 md:p-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 500px 300px at 0% 0%, rgba(45,212,191,0.12), transparent 65%)",
          }}
        />
        <div className="relative flex flex-col gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Continue where you left off
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {project.name}
          </h2>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full text-teal-400 bg-teal-500/10 border border-teal-500/20">
              <span className="size-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-pulse" />
              Active
            </span>
            {summary?.last_review_branch && (
              <span className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-muted-foreground">
                <GitBranchIcon className="size-3" />
                {summary.last_review_branch}
              </span>
            )}
            <span className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-muted-foreground">
              <ShieldIcon className="size-3" />
              {summary ? lastReviewLabel(summary) : "No reviews yet"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {summary && hasReviews ? (
              <>
                <strong className="text-foreground font-semibold">
                  {summary.decisions_count}
                </strong>{" "}
                decisions logged · architectural health{" "}
                <strong className="text-foreground font-semibold">
                  {summary.health}
                </strong>
              </>
            ) : (
              <>
                Run{" "}
                <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                  saedra review
                </code>{" "}
                to check architectural health and surface pending decisions.
              </>
            )}
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <Button variant="brand" size="lg" asChild>
              <Link href={`/dashboard/project/${project.id}`}>
                Open project <ChevronRightIcon className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                return toast.info(
                  "Run 'saedra review' in your terminal to start a new review.",
                );
              }}
            >
              <SparklesIcon className="size-4" /> Run review
            </Button>
          </div>
        </div>
      </div>

      {/* Preview side */}
      <div className="bg-zinc-950 p-6 flex flex-col">
        {/* Preview header with tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            <button
              onClick={() => {
                return setMode("decisions");
              }}
              className={`text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer ${mode === "decisions" ? "bg-zinc-800 text-foreground" : "text-zinc-500 hover:text-foreground"}`}
            >
              Decisions
            </button>
            {summary && (
              <button
                onClick={() => {
                  return setMode("metrics");
                }}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer ${mode === "metrics" ? "bg-zinc-800 text-foreground" : "text-zinc-500 hover:text-foreground"}`}
              >
                Metrics
              </button>
            )}
          </div>
          {mode === "decisions" && hasDecisions && (
            <Link
              href={`/dashboard/project/${project.id}/decisions`}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRightIcon className="size-3" />
            </Link>
          )}
          {mode === "metrics" && (
            <span className="text-[11px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
              7d
            </span>
          )}
        </div>

        {/* Preview content */}
        {mode === "decisions" || !summary ? (
          <RecentDecisionsPreview
            hasMemory={project.has_memory}
            decisions={decisions}
          />
        ) : (
          <MetricsPreview summary={summary} />
        )}
      </div>
    </div>
  );
};
