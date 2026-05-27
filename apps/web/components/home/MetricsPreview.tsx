import type { ProjectSummary } from "../../auth/projects";

interface Props {
  summary: ProjectSummary;
}

const Sparkline = ({ data }: { data: number[] }) => {
  if (data.length < 2) return null;
  const w = 110;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data
    .map((v, i) => {
      return `${i * step},${h - ((v - min) / range) * (h - 6) - 3}`;
    })
    .join(" ");
  const lastX = (data.length - 1) * step;
  const lastVal = data[data.length - 1] ?? 0;
  const lastY = h - ((lastVal - min) / range) * (h - 6) - 3;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="#2dd4bf"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill="#2dd4bf" />
    </svg>
  );
};

const barColor = (score: number) => {
  if (score >= 85) return "bg-teal-400";
  if (score >= 70) return "bg-yellow-400";
  return "bg-red-400";
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Health
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold">
              {health ?? "—"}
            </span>
            {health_delta !== 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-mono ${health_delta > 0 ? "bg-teal-500/10 text-teal-400" : "bg-red-500/10 text-red-400"}`}
              >
                {health_delta > 0 ? "+" : ""}
                {health_delta}
              </span>
            )}
          </div>
          {health_history.length >= 2 ? (
            <Sparkline data={health_history} />
          ) : (
            <p className="text-[11px] text-zinc-600">Not enough data yet</p>
          )}
        </div>

        {/* Reviews card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Reviews
          </p>
          <p className="text-sm font-mono">
            <span className="text-foreground font-semibold">
              {cleanReviews}
            </span>
            <span className="text-zinc-500"> / {totalReviews} clean</span>
          </p>
          {totalReviews > 0 ? (
            cleanReviews === totalReviews ? (
              <span className="flex items-center gap-1.5 text-[11px] text-teal-400 font-mono">
                <span className="size-1.5 rounded-full bg-teal-400" />
                All clean
              </span>
            ) : (
              <div className="flex items-end gap-[2px] h-6">
                {health_history.map((score, i) => {
                  return (
                    <span
                      key={i}
                      className={`w-[5px] rounded-sm ${barColor(score)}`}
                      style={{ height: `${Math.max(3, (score / 100) * 24)}px` }}
                    />
                  );
                })}
              </div>
            )
          ) : (
            <p className="text-[11px] text-zinc-600">No reviews yet</p>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-6 pt-3 border-t border-zinc-800 text-[11px] font-mono">
        <div>
          <strong className="text-foreground">{decisions_count}</strong>{" "}
          <span className="text-zinc-500">decisions</span>
        </div>
        <div>
          <strong className="text-foreground">{totalReviews}</strong>{" "}
          <span className="text-zinc-500">reviews</span>
        </div>
      </div>
    </div>
  );
};
