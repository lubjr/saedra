"use client";

import * as React from "react";
import { toast } from "sonner";

import type { Decision } from "../../../auth/documents";
import type { ProjectSummary } from "../../../auth/projects";
import type { ReviewSummary } from "../../../auth/reviews";
import { MetricsHeader } from "./MetricsHeader";
import { MetricsKpiStrip } from "./MetricsKpiStrip";
import { ViolationsCard } from "./ViolationsCard";

type Range = "7d" | "30d" | "90d" | "all";

interface Props {
  projectName: string;
  summary: ProjectSummary | null;
  reviews: ReviewSummary[];
  decisions: Decision[];
}

const formatMonth = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const sliceByRange = (
  sorted: ReviewSummary[],
  range: Range,
  previousPeriod = false,
): ReviewSummary[] => {
  if (range === "all") return previousPeriod ? [] : sorted;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const msPerDay = 86400000;
  const now = Date.now();
  const cutoff = now - days * msPerDay;
  const prevCutoff = cutoff - days * msPerDay;
  if (previousPeriod) {
    return sorted.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return t >= prevCutoff && t < cutoff;
    });
  }
  return sorted.filter((r) => {
    return new Date(r.created_at).getTime() >= cutoff;
  });
};

export const MetricsClient = ({
  projectName,
  summary,
  reviews,
  decisions,
}: Props) => {
  const [range, setRange] = React.useState<Range>("90d");

  const sortedReviews = [...reviews].sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const visibleReviews = sliceByRange(sortedReviews, range);
  const totalReviews = visibleReviews.length;
  const cleanReviews = visibleReviews.filter((r) => {
    return r.violations === 0;
  }).length;
  const passRate =
    totalReviews > 0 ? Math.round((cleanReviews / totalReviews) * 100) : null;

  const avgViolations =
    totalReviews > 0
      ? visibleReviews.reduce((s, r) => {
          return s + r.violations;
        }, 0) / totalReviews
      : 0;
  const prevReviews = sliceByRange(sortedReviews, range, true);
  const prevAvg =
    prevReviews.length > 0
      ? prevReviews.reduce((s, r) => {
          return s + r.violations;
        }, 0) / prevReviews.length
      : 0;
  const avgDelta = totalReviews > 0 ? avgViolations - prevAvg : 0;

  const chartData = visibleReviews.map((r) => {
    return {
      date: formatMonth(r.created_at),
      violations: r.violations,
      warnings: r.warnings,
    };
  });

  const health = summary?.health ?? null;
  const healthDelta = summary?.health_delta ?? 0;
  const healthHistory = summary?.health_history ?? [];

  // TODO: filter decisions by range when volume warrants it
  const activeDecisions = decisions.filter((d) => {
    return d.status === "active";
  }).length;
  const supersededDecisions = decisions.filter((d) => {
    return d.status === "superseded";
  }).length;

  const handleExport = () => {
    void navigator.clipboard.writeText(
      JSON.stringify({ chartData, decisions }, null, 2),
    );
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <MetricsHeader
        projectName={projectName}
        summary={summary}
        range={range}
        onRangeChange={setRange}
        onExport={handleExport}
      />
      <MetricsKpiStrip
        health={health}
        healthDelta={healthDelta}
        healthHistory={healthHistory}
        cleanReviews={cleanReviews}
        totalReviews={totalReviews}
        passRate={passRate}
        totalDecisions={decisions.length}
        activeDecisions={activeDecisions}
        supersededDecisions={supersededDecisions}
        avgViolations={avgViolations}
        avgDelta={avgDelta}
        range={range}
      />
      <ViolationsCard
        chartData={chartData}
        reviewCount={totalReviews}
        range={range}
      />
    </>
  );
};
