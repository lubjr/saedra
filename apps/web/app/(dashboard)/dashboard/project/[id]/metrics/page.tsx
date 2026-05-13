import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { CheckCircle2Icon, ShieldIcon, TargetIcon } from "@repo/ui/lucide";

import { getDecisions } from "../../../../../../auth/documents";
import { getProjectReviews } from "../../../../../../auth/reviews";
import { ViolationsChart } from "../../../../../../components/ViolationsChart";

interface PageProps {
  params: Promise<{ id: string }>;
}

const riskColor: Record<string, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-teal-400",
};

const statusTextColor: Record<string, string> = {
  active: "text-teal-400",
  deprecated: "text-zinc-400",
  superseded: "text-yellow-400",
};

const formatMonth = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatDecisionDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [reviews, decisions] = await Promise.all([
    getProjectReviews(id),
    getDecisions(id),
  ]);

  const totalReviews = reviews.length;
  const cleanReviews = reviews.filter((r) => {
    return r.violations === 0;
  }).length;
  const healthScore =
    totalReviews > 0 ? Math.round((cleanReviews / totalReviews) * 100) : null;

  const chartData = [...reviews].reverse().map((r) => {
    return {
      date: formatMonth(r.created_at),
      violations: r.violations,
      warnings: r.warnings,
    };
  });

  const sortedDecisions = [...decisions].sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Metrics</h1>
        <p className="text-sm text-muted-foreground">
          Architectural health and evolution over time.
        </p>
      </div>

      {/* Health indicator */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-zinc-900 py-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TargetIcon className="h-4 w-4 text-teal-400 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {healthScore !== null ? `${healthScore}%` : "—"}
                </p>
                <p className="text-xs text-muted-foreground">health score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 py-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-2xl font-bold text-white">{totalReviews}</p>
                <p className="text-xs text-muted-foreground">
                  total review{totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 py-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-teal-400 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-white">{cleanReviews}</p>
                <p className="text-xs text-muted-foreground">clean reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Violations over time */}
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Violations Over Time
          </CardTitle>
          <CardDescription>
            Violations and warnings per review, oldest to newest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ViolationsChart data={chartData} />
        </CardContent>
      </Card>

      {/* Decision timeline */}
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2Icon className="h-5 w-5" />
            Decision Timeline
          </CardTitle>
          <CardDescription>
            Architecture decisions ordered by creation date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedDecisions.length > 0 ? (
            <div className="space-y-0">
              {sortedDecisions.map((dec, i) => {
                return (
                  <div key={dec.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          dec.status === "active"
                            ? "bg-teal-400"
                            : dec.status === "superseded"
                              ? "bg-yellow-400"
                              : "bg-zinc-500"
                        }`}
                      />
                      {i < sortedDecisions.length - 1 && (
                        <div className="w-px flex-1 bg-zinc-700 mt-1" />
                      )}
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="text-sm font-medium">{dec.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDecisionDate(dec.created_at)} ·{" "}
                        <span className={riskColor[dec.risk_level]}>
                          {dec.risk_level} risk
                        </span>{" "}
                        ·{" "}
                        <span
                          className={`text-xs ${statusTextColor[dec.status]}`}
                        >
                          {dec.status}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No decisions yet. Run{" "}
              <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                saedra memory decision add
              </code>{" "}
              to record your first architecture decision.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
