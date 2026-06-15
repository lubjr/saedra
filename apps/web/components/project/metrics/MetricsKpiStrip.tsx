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
  if (score >= 85) return "text-teal-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
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
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Health
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-3xl font-mono font-semibold ${health !== null ? healthColor(health) : "text-zinc-600"}`}
          >
            {health ?? "—"}
          </span>
          {healthDelta !== 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-mono ${healthDelta > 0 ? "bg-teal-500/10 text-teal-400" : "bg-red-500/10 text-red-400"}`}
            >
              {healthDelta > 0 ? "+" : ""}
              {healthDelta}
            </span>
          )}
        </div>
        {healthHistory.length >= 2 ? (
          <Sparkline data={healthHistory} />
        ) : (
          <p className="text-[11px] font-mono text-zinc-600">
            Run a review to compute
          </p>
        )}
      </div>

      {/* Reviews */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Reviews
        </p>
        <p className="text-3xl font-mono font-semibold">
          {cleanReviews}
          <span className="text-zinc-600">/</span>
          {totalReviews}
        </p>
        <p className="text-[11px] font-mono text-zinc-500">
          {totalReviews > 0
            ? `clean · ${passRate}% pass rate`
            : "no reviews yet"}
        </p>
      </div>

      {/* Decisions */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Decisions
        </p>
        <p className="text-3xl font-mono font-semibold">{totalDecisions}</p>
        <p className="text-[11px] font-mono text-zinc-500">
          {activeDecisions} active · {supersededDecisions} superseded
        </p>
      </div>

      {/* Avg violations */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Avg violations
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-mono font-semibold">
            {avgViolations.toFixed(1)}
          </span>
          {avgDelta !== 0 && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-mono ${avgDelta < 0 ? "bg-teal-500/10 text-teal-400" : "bg-red-500/10 text-red-400"}`}
            >
              {avgDelta > 0 ? "+" : ""}
              {avgDelta.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-[11px] font-mono text-zinc-500">
          per review · {range}
        </p>
      </div>
    </div>
  );
};
