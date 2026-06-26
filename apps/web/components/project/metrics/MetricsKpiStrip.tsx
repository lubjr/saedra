import { Sparkline } from "../../charts/Sparkline";

interface Props {
  health: number | null;
  healthDelta: number;
  healthHistory: number[];
  cleanReviews: number;
  totalReviews: number;
  passRate: number | null;
  totalDecisions: number;
  activeDecisions: number;
  supersededDecisions: number;
  avgViolations: number;
  avgDelta: number;
  range: string;
}

const healthColor = (score: number) => {
  if (score >= 85) return "text-brand";
  if (score >= 70) return "text-status-warning";
  return "text-status-error";
};

export const MetricsKpiStrip = ({
  health,
  healthDelta,
  healthHistory,
  cleanReviews,
  totalReviews,
  passRate,
  totalDecisions,
  activeDecisions,
  supersededDecisions,
  avgViolations,
  avgDelta,
  range,
}: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Health */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Health
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-3xl font-mono font-semibold ${health !== null ? healthColor(health) : "text-muted-foreground"}`}
          >
            {health ?? "—"}
          </span>
          {healthDelta !== 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-mono ${healthDelta > 0 ? "bg-brand-fill text-brand" : "bg-status-error-fill text-status-error"}`}
            >
              {healthDelta > 0 ? "+" : ""}
              {healthDelta}
            </span>
          )}
        </div>
        {healthHistory.length >= 2 ? (
          <Sparkline data={healthHistory} />
        ) : (
          <p className="text-[11px] font-mono text-muted-foreground">
            Run a review to compute
          </p>
        )}
      </div>

      {/* Reviews */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Reviews
        </p>
        <p className="text-3xl font-mono font-semibold">
          {cleanReviews}
          <span className="text-muted-foreground">/</span>
          {totalReviews}
        </p>
        <p className="text-[11px] font-mono text-muted-foreground">
          {totalReviews > 0
            ? `clean · ${passRate}% pass rate`
            : "no reviews yet"}
        </p>
      </div>

      {/* Decisions */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Decisions
        </p>
        <p className="text-3xl font-mono font-semibold">{totalDecisions}</p>
        <p className="text-[11px] font-mono text-muted-foreground">
          {activeDecisions} active · {supersededDecisions} superseded
        </p>
      </div>

      {/* Avg violations */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Avg violations
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-mono font-semibold">
            {avgViolations.toFixed(1)}
          </span>
          {avgDelta !== 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-mono ${avgDelta < 0 ? "bg-brand-fill text-brand" : "bg-status-error-fill text-status-error"}`}
            >
              {avgDelta > 0 ? "+" : ""}
              {avgDelta.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-muted-foreground">
          per review · {range}
        </p>
      </div>
    </div>
  );
};
