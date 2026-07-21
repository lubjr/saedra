"use client";

import { Button } from "@repo/ui/button";
import { PlusIcon } from "@repo/ui/lucide";
import { Skeleton } from "@repo/ui/skeleton";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import type { Decision } from "../../../auth/documents";
import { getDecisions } from "../../../auth/documents";
import type { ProjectSummary } from "../../../auth/projects";
import { getProjectSummaries } from "../../../auth/projects";
import { EmptyProjects } from "../../../components/EmptyProjects";
import { ContinueHero } from "../../../components/home/ContinueHero";
import { FilterChips } from "../../../components/home/FilterChips";
import { ProjectCard } from "../../../components/home/ProjectCard";
import { SearchInput } from "../../../components/home/SearchInput";
import { SetupBanner } from "../../../components/home/SetupBanner";
import { usePreferences } from "../../../hooks/usePreferences";
import { useProjectLimit } from "../../../hooks/useProjectLimit";
import { useProjects } from "../../contexts/ProjectsContext";

type Filter = "all" | "active" | "setup" | "archived";

export default function Page() {
  React.useEffect(() => {
    toast.dismiss("login");
  }, []);

  const { projects, isLoading } = useProjects();
  const { isAtLimit } = useProjectLimit();
  const { prefs } = usePreferences();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");
  const [summaries, setSummaries] = React.useState<
    Record<string, ProjectSummary>
  >({});
  const [heroDecisions, setHeroDecisions] = React.useState<Decision[]>([]);

  const projectsList = Array.isArray(projects)
    ? projects
    : projects
      ? [projects]
      : [];

  const sorted = [...projectsList].sort((a, b) => {
    if (prefs.projectSort === "name") {
      return a.name.localeCompare(b.name);
    }
    if (prefs.projectSort === "health") {
      const aH = summaries[a.id]?.health ?? -1;
      const bH = summaries[b.id]?.health ?? -1;
      return bH - aH;
    }
    const aTime = summaries[a.id]?.last_activity_at ?? a.created_at;
    const bTime = summaries[b.id]?.last_activity_at ?? b.created_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  const searched = query
    ? sorted.filter((p) => {
        return p.name.toLowerCase().includes(query.toLowerCase());
      })
    : sorted;

  const hero = !query ? sorted[0] : undefined;
  const heroForDecisions = sorted[0];

  React.useEffect(() => {
    getProjectSummaries().then((data) => {
      const map: Record<string, ProjectSummary> = {};
      for (const s of data) {
        map[s.id] = s;
      }
      setSummaries(map);
    });
  }, []);

  React.useEffect(() => {
    if (!heroForDecisions?.id) return;
    getDecisions(heroForDecisions.id).then((decisions) => {
      setHeroDecisions(decisions.slice(0, 4));
    });
  }, [heroForDecisions?.id]);

  const summaryList = Object.values(summaries);
  const totalDecisions = summaryList.reduce((acc, s) => {
    return acc + (s.decisions_count ?? 0);
  }, 0);
  const totalReviews = summaryList.reduce((acc, s) => {
    return acc + (s.reviews_count ?? 0);
  }, 0);
  const counts: Record<Filter, number> = {
    all: searched.length,
    active:
      summaryList.length > 0
        ? searched.filter((p) => {
            return (summaries[p.id]?.status ?? "active") === "active";
          }).length
        : searched.length,
    setup: searched.filter((p) => {
      return summaries[p.id]?.status === "setup";
    }).length,
    archived: searched.filter((p) => {
      return summaries[p.id]?.status === "archived";
    }).length,
  };

  const filtered = searched.filter((p) => {
    if (filter === "all") return true;
    const status = summaries[p.id]?.status ?? "active";
    return status === filter;
  });

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
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sorted.length} {sorted.length === 1 ? "project" : "projects"}
            {summaryList.length > 0 && (
              <>
                {" · "}
                {totalDecisions}{" "}
                {totalDecisions === 1 ? "decision" : "decisions"}
                {" · "}
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </>
            )}
          </p>
        </div>
        <div className="flex-1" />
        <SearchInput value={query} onChange={setQuery} />
        <Button
          variant="brand"
          size="sm"
          asChild={!isAtLimit}
          disabled={isAtLimit}
          className="shrink-0"
          title={
            isAtLimit
              ? "Standard plan limit reached — upgrade to add more projects"
              : undefined
          }
        >
          {isAtLimit ? (
            <span className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              New Project
            </span>
          ) : (
            <Link href="/dashboard/new-project">
              <PlusIcon className="h-4 w-4" />
              New Project
            </Link>
          )}
        </Button>
      </div>

      {/* Continue hero — hidden during search */}
      {hero && (
        <ContinueHero
          project={hero}
          summary={summaries[hero.id]}
          decisions={heroDecisions.length > 0 ? heroDecisions : undefined}
        />
      )}

      {/* Search empty state */}
      {query && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No projects match &ldquo;{query}&rdquo;
        </p>
      )}

      {/* All projects grid */}
      {filtered.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {query ? "Results" : "All projects"}
            </p>
            <FilterChips active={filter} onChange={setFilter} counts={counts} />
          </div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${prefs.density === "compact" ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {filtered.map((project) => {
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  summary={summaries[project.id]}
                  timestamps={prefs.timestamps}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Setup banner */}
      <SetupBanner />
    </div>
  );
}
