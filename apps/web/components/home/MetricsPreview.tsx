import type { ProjectSummary } from "../../auth/projects";
import { Sparkline } from "../charts/Sparkline";

interface Props {
  summary: ProjectSummary;
}

const barColor = (score: number) => {
  if (score >= 85) return "bg-brand";
  if (score >= 70) return "bg-status-warning";
  return "bg-status-error";
};

export const MetricsPreview = ({ summary }: Props) => {
  const { health, health_delta, health_history, decisions_count } = summary;
  const totalReviews = health_history.length;
  const cleanReviews = health_history.filter((h) => {
    return h >= 85;
  }).length;

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Metric cards row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Health card */}
        <div className="bg-card border border-border rounded-lg p-3.5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Health
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold">
              {health ?? "—"}
            </span>
            {health_delta !== 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-mono ${health_delta > 0 ? "bg-brand-fill text-brand" : "bg-status-error-fill text-status-error"}`}
              >
                {health_delta > 0 ? "+" : ""}
                {health_delta}
              </span>
            )}
          </div>
          {health_history.length >= 2 ? (
            <Sparkline data={health_history} />
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Not enough data yet
            </p>
          )}
        </div>

        {/* Reviews card */}
        <div className="bg-card border border-border rounded-lg p-3.5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Reviews
          </p>
          <p className="text-sm font-mono">
            <span className="text-foreground font-semibold">
              {cleanReviews}
            </span>
            <span className="text-muted-foreground">
              {" "}
              / {totalReviews} clean
            </span>
          </p>
          {totalReviews > 0 ? (
            cleanReviews === totalReviews ? (
              <span className="flex items-center gap-1.5 text-[11px] text-brand font-mono">
                <span className="size-1.5 rounded-full bg-brand" />
                All clean
              </span>
            ) : (
              <div className="flex items-end gap-[2px] h-6">
                {health_history.map((score, i) => {
                  return (
                    <span
                      key={i}
                      className={`flex-1 rounded-sm ${barColor(score)}`}
                      style={{ height: `${Math.max(3, (score / 100) * 24)}px` }}
                    />
                  );
                })}
              </div>
            )
          ) : (
            <p className="text-[11px] text-muted-foreground">No reviews yet</p>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-6 pt-3 border-t border-border text-[11px] font-mono">
        <div>
          <strong className="text-foreground">{decisions_count}</strong>{" "}
          <span className="text-muted-foreground">decisions</span>
        </div>
        <div>
          <strong className="text-foreground">{totalReviews}</strong>{" "}
          <span className="text-muted-foreground">reviews</span>
        </div>
      </div>
    </div>
  );
};
