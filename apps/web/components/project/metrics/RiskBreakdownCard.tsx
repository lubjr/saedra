import { ClockIcon } from "@repo/ui/lucide";

interface RiskRow {
  label: "low" | "medium" | "high";
  count: number;
  pct: number;
}

interface Props {
  rows: RiskRow[];
  projectId: string;
}

const riskText: Record<string, string> = {
  low: "text-teal-400",
  medium: "text-yellow-400",
  high: "text-red-400",
};

const riskBar: Record<string, string> = {
  low: "bg-teal-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export const RiskBreakdownCard = ({ rows, projectId }: Props) => {
  const total = rows.reduce((s, r) => {
    return s + r.count;
  }, 0);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-zinc-400" />
          <p className="text-sm font-medium">Decisions by risk</p>
        </div>
        <a
          href={`/dashboard/project/${projectId}/decisions`}
          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          filter →
        </a>
      </div>
      <div className="px-5 py-4 space-y-3">
        {total === 0 ? (
          <p className="text-sm text-zinc-500">No decisions yet.</p>
        ) : (
          rows.map((r) => {
            return (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[11px] font-mono font-medium ${riskText[r.label]}`}
                  >
                    {r.label}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {r.count} · {r.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${riskBar[r.label]}`}
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
