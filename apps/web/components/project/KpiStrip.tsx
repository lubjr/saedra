import type { Decision, ViolationRule } from "../../auth/documents";
import type { ProjectSummary } from "../../auth/projects";
import type { ReviewSummary } from "../../auth/reviews";
import { Sparkline } from "../charts/Sparkline";

interface Props {
  summary: ProjectSummary | null;
  decisions: Decision[];
  reviews: ReviewSummary[];
  rules: ViolationRule[];
}

const healthColor = (score: number) => {
  if (score >= 85) return "text-teal-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
};

const StatTile = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="text-3xl font-mono font-semibold">{value}</p>
      {sub && <div className="text-[11px] font-mono text-zinc-500">{sub}</div>}
    </div>
  );
};

export const KpiStrip = ({ summary, decisions, reviews, rules }: Props) => {
  const health = summary?.health ?? null;
  const healthDelta = summary?.health_delta ?? 0;
  const healthHistory = summary?.health_history ?? [];

  const cleanReviews = reviews.filter((r) => {
    return r.violations === 0;
  }).length;

  const highRules = rules.filter((r) => {
    return r.severity === "high";
  }).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
          <p className="text-[11px] text-zinc-600">Run a review to compute</p>
        )}
      </div>

      <StatTile label="Decisions" value={decisions.length} />

      <StatTile
        label="Reviews"
        value={`${cleanReviews}/${reviews.length}`}
        sub={reviews.length > 0 ? "clean" : "no reviews yet"}
      />

      <StatTile
        label="Open rules"
        value={rules.length}
        sub={
          highRules > 0 ? (
            <span className="text-yellow-400">{highRules} high</span>
          ) : undefined
        }
      />
    </div>
  );
};
