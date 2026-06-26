import type { ReviewDetail } from "../../auth/reviews";

interface Props {
  review: ReviewDetail;
}

const resultLabel = (violations: number, warnings: number) => {
  if (violations > 0) return { text: "Failing", color: "text-status-error" };
  if (warnings > 0) return { text: "Warning", color: "text-status-warning" };
  return { text: "Clean", color: "text-brand" };
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
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`text-3xl font-mono font-semibold ${valueColor ?? "text-foreground"}`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11px] font-mono text-muted-foreground">{sub}</p>
      )}
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
        valueColor={
          review.violations > 0 ? "text-status-error" : "text-muted-foreground"
        }
      />
      <StatTile
        label="Warnings"
        value={review.warnings}
        valueColor={
          review.warnings > 0 ? "text-status-warning" : "text-muted-foreground"
        }
      />
      <StatTile
        label="Files"
        value={review.total_files}
        sub={`${review.ok} passed`}
      />
    </div>
  );
};
