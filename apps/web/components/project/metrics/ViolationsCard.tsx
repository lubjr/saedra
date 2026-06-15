import { ShieldIcon } from "@repo/ui/lucide";

import { ViolationsChart } from "../../ViolationsChart";

interface DataPoint {
  date: string;
  violations: number;
  warnings: number;
}

interface Props {
  chartData: DataPoint[];
  reviewCount: number;
  range: string;
}

export const ViolationsCard = ({ chartData, reviewCount, range }: Props) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <ShieldIcon className="size-4 text-zinc-400" />
          <p className="text-sm font-medium">Violations over time</p>
          <span className="font-mono text-[11px] text-zinc-500">
            {reviewCount} reviews · {range}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-red-400" />
            violations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-yellow-400" />
            warnings
          </span>
        </div>
      </div>
      <div className="px-5 pt-5 pb-4">
        <ViolationsChart data={chartData} />
      </div>
    </div>
  );
};
