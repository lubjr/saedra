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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldIcon className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">Violations over time</p>
          <span className="font-mono text-[11px] text-muted-foreground">
            {reviewCount} reviews · {range}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-status-error" />
            violations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-status-warning" />
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
