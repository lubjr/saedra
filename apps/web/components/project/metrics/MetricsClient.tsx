"use client";

import * as React from "react";
import { toast } from "sonner";

import type { Decision } from "../../../auth/documents";
import type { ProjectSummary } from "../../../auth/projects";
import type { ReviewSummary } from "../../../auth/reviews";
import { DecisionTimelineCard } from "./DecisionTimelineCard";
import { MetricsHeader } from "./MetricsHeader";
import { MetricsKpiStrip } from "./MetricsKpiStrip";
import { ReviewStreakCard } from "./ReviewStreakCard";
import { RiskBreakdownCard } from "./RiskBreakdownCard";
import { ViolationsCard } from "./ViolationsCard";

type Range = "7d" | "30d" | "90d" | "all";

interface Props {
  projectId: string;
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
  projectId,
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

  const streakCells = ((): ("clean" | "warning" | "violation" | "empty")[] => {
    const last12 = sortedReviews.slice(-12);
    const classified = last12.map((r) => {
      if (r.violations > 0) return "violation" as const;
      if (r.warnings > 0) return "warning" as const;
      return "clean" as const;
    });
    const padding = Array<"empty">(Math.max(0, 12 - classified.length)).fill(
      "empty",
    );
    return [...padding, ...classified];
  })();

  const streak = (() => {
    let count = 0;
    for (let i = streakCells.length - 1; i >= 0; i--) {
      if (streakCells[i] === "clean") count++;
      else break;
    }
    return count;
  })();

  const riskTotal = decisions.length;
  const riskCounts = {
    low: decisions.filter((d) => {
      return d.risk_level === "low";
    }).length,
    medium: decisions.filter((d) => {
      return d.risk_level === "medium";
    }).length,
    high: decisions.filter((d) => {
      return d.risk_level === "high";
    }).length,
  };
  const riskRows = (["low", "medium", "high"] as const).map((label) => {
    return {
      label,
      count: riskCounts[label],
      pct:
        riskTotal > 0 ? Math.round((riskCounts[label] / riskTotal) * 100) : 0,
    };
  });

  const sortedDecisions = [...decisions].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleExport = () => {
    void navigator.clipboard.writeText(
      JSON.stringify({ chartData, decisions }, null, 2),
    );
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <MetricsHeader
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

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5 items-start">
        <DecisionTimelineCard
          projectId={projectId}
          decisions={sortedDecisions}
          range={range}
        />
        <div className="flex flex-col gap-5">
          <ReviewStreakCard cells={streakCells} streak={streak} />
          <RiskBreakdownCard rows={riskRows} projectId={projectId} />
        </div>
      </div>
    </>
  );
};
