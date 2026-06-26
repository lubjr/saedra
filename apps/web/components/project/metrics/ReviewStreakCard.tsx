import { ActivityIcon } from "@repo/ui/lucide";

type Cell = "clean" | "warning" | "violation" | "empty";

interface Props {
  cells: Cell[];
  streak: number;
}

const cellColor: Record<Cell, string> = {
  clean: "bg-brand/60",
  warning: "bg-status-warning/60",
  violation: "bg-status-error/60",
  empty: "bg-border",
};

export const ReviewStreakCard = ({ cells, streak }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ActivityIcon className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">Review streak</p>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          last 12 reviews
        </span>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-mono font-semibold text-brand">
            {streak}
          </span>
          <span className="text-[11px] font-mono text-muted-foreground">
            clean reviews in a row
          </span>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {cells.map((c, i) => {
            return <span key={i} className={`h-7 rounded ${cellColor[c]}`} />;
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-brand/60" />
            clean
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-status-warning/60" />
            warnings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-status-error/60" />
            violations
          </span>
        </div>
      </div>
    </div>
  );
};
