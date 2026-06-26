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
  low: "text-brand",
  medium: "text-status-warning",
  high: "text-status-error",
};

const riskBar: Record<string, string> = {
  low: "bg-brand-solid",
  medium: "bg-status-warning",
  high: "bg-status-error",
};

export const RiskBreakdownCard = ({ rows, projectId }: Props) => {
  const total = rows.reduce((s, r) => {
    return s + r.count;
  }, 0);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">Decisions by risk</p>
        </div>
        <a
          href={`/dashboard/project/${projectId}/decisions`}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground/80 transition-colors"
        >
          filter →
        </a>
      </div>
      <div className="px-5 py-4 space-y-3">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">No decisions yet.</p>
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
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {r.count} · {r.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
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
