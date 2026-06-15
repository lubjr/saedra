import type { ReviewSummary } from "../../auth/reviews";

interface Props {
  reviews: ReviewSummary[];
}

const passRateColor = (rate: number) => {
  if (rate >= 85) return "text-teal-400";
  if (rate >= 70) return "text-yellow-400";
  return "text-red-400";
};

const StatTile = ({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string;
  value: string | number;
  valueColor?: string;
  sub?: string;
}) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p
        className={`text-3xl font-mono font-semibold ${valueColor ?? "text-foreground"}`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] font-mono text-zinc-500">{sub}</p>}
    </div>
  );
};

export const ReviewsKpiStrip = ({ reviews }: Props) => {
  const total = reviews.length;
  const totalViolations = reviews.reduce((acc, r) => {
    return acc + r.violations;
  }, 0);
  const totalWarnings = reviews.reduce((acc, r) => {
    return acc + r.warnings;
  }, 0);
  const clean = reviews.filter((r) => {
    return r.violations === 0;
  }).length;
  const passRate = total > 0 ? Math.round((clean / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatTile label="Reviews" value={total} />
      <StatTile
        label="Violations"
        value={totalViolations}
        valueColor={totalViolations > 0 ? "text-red-400" : "text-zinc-500"}
      />
      <StatTile
        label="Warnings"
        value={totalWarnings}
        valueColor={totalWarnings > 0 ? "text-yellow-400" : "text-zinc-500"}
      />
      <StatTile
        label="Pass rate"
        value={total > 0 ? `${passRate}%` : "—"}
        valueColor={total > 0 ? passRateColor(passRate) : "text-zinc-500"}
        sub={total > 0 ? `${clean}/${total} clean` : undefined}
      />
    </div>
  );
};
