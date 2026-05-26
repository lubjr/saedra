"use client";

import { Button } from "@repo/ui/button";
import { PlusIcon } from "@repo/ui/lucide";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { EmptyProjects } from "../../../components/EmptyProjects";
import { ContinueHero } from "../../../components/home/ContinueHero";
import { FilterChips } from "../../../components/home/FilterChips";
import { ProjectCard } from "../../../components/home/ProjectCard";
import { SetupBanner } from "../../../components/home/SetupBanner";
import { useProjects } from "../../contexts/ProjectsContext";

type Filter = "all" | "active" | "setup" | "archived";

export default function Page() {
  React.useEffect(() => {
    toast.dismiss("login");
  }, []);

  const { projects, isLoading } = useProjects();
  const [filter, setFilter] = React.useState<Filter>("all");

  const projectsList = Array.isArray(projects)
    ? projects
    : projects
      ? [projects]
      : [];

  const sorted = [...projectsList].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const hero = sorted[0];
  const rest = sorted.slice(1);

  const counts: Record<Filter, number> = {
    all: rest.length,
    active: rest.length,
    setup: 0,
    archived: 0,
  };

  const filtered = filter === "archived" || filter === "setup" ? [] : rest;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="w-full rounded-2xl" style={{ height: "240px" }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Skeleton className="w-full rounded-xl" style={{ height: "140px" }} />
          <Skeleton className="w-full rounded-xl" style={{ height: "140px" }} />
          <Skeleton className="w-full rounded-xl" style={{ height: "140px" }} />
        </div>
      </div>
    );
  }

  if (projectsList.length === 0) {
    return <EmptyProjects />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-16">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sorted.length} {sorted.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/new-project">
            <PlusIcon className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Continue hero */}
      {hero && <ContinueHero project={hero} />}

      {/* All projects grid */}
      {rest.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              All projects
            </p>
            <FilterChips active={filter} onChange={setFilter} counts={counts} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((project) => {
              return <ProjectCard key={project.id} project={project} />;
            })}
          </div>
        </section>
      )}

      {/* Setup banner */}
      <SetupBanner />
    </div>
  );
}
