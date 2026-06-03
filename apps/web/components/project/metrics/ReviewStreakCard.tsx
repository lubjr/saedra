import { ActivityIcon } from "@repo/ui/lucide";

type Cell = "clean" | "warning" | "violation" | "empty";

interface Props {
  cells: Cell[];
  streak: number;
}

const cellColor: Record<Cell, string> = {
  clean: "bg-teal-500/60",
  warning: "bg-yellow-500/60",
  violation: "bg-red-500/60",
  empty: "bg-zinc-800",
};

export const ReviewStreakCard = ({ cells, streak }: Props) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <ActivityIcon className="size-4 text-zinc-400" />
          <p className="text-sm font-medium">Review streak</p>
        </div>
        <span className="font-mono text-[11px] text-zinc-500">
          last 12 reviews
        </span>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-mono font-semibold text-teal-400">
            {streak}
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            clean reviews in a row
          </span>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {cells.map((c, i) => {
            return <span key={i} className={`h-7 rounded ${cellColor[c]}`} />;
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-teal-500/60" />
            clean
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-yellow-500/60" />
            warnings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-red-500/60" />
            violations
          </span>
        </div>
      </div>
    </div>
  );
};
