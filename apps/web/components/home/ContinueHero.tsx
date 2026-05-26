"use client";

import { Button } from "@repo/ui/button";
import { ChevronRightIcon, ShieldIcon, SparklesIcon } from "@repo/ui/lucide";
import Link from "next/link";
import { toast } from "sonner";

import { RecentDecisionsPreview } from "./RecentDecisionsPreview";

interface Project {
  id: string;
  name: string;
  created_at: string;
  has_memory: boolean;
}

export const ContinueHero = ({ project }: { project: Project }) => {
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
            <span className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-muted-foreground">
              <ShieldIcon className="size-3" />
              No reviews yet
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra review
            </code>{" "}
            to check architectural health and surface pending decisions.
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
              onClick={() =>
                toast.info(
                  "Run 'saedra review' in your terminal to start a new review.",
                )
              }
            >
              <SparklesIcon className="size-4" /> Run review
            </Button>
          </div>
        </div>
      </div>

      {/* Preview side */}
      <RecentDecisionsPreview
        projectId={project.id}
        hasMemory={project.has_memory}
      />
    </div>
  );
};
