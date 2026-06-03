import type { ReviewDetail } from "../../auth/reviews";

interface Props {
  review: ReviewDetail;
}

const resultLabel = (violations: number, warnings: number) => {
  if (violations > 0) return { text: "Failing", color: "text-red-400" };
  if (warnings > 0) return { text: "Warning", color: "text-yellow-400" };
  return { text: "Clean", color: "text-teal-400" };
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

export const ReviewKpiStrip = ({ review }: Props) => {
  const result = resultLabel(review.violations, review.warnings);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatTile label="Result" value={result.text} valueColor={result.color} />
      <StatTile
        label="Violations"
        value={review.violations}
        valueColor={review.violations > 0 ? "text-red-400" : "text-zinc-500"}
      />
      <StatTile
        label="Warnings"
        value={review.warnings}
        valueColor={review.warnings > 0 ? "text-yellow-400" : "text-zinc-500"}
      />
      <StatTile
        label="Files"
        value={review.total_files}
        sub={`${review.ok} passed`}
      />
    </div>
  );
};
