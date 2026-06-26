import { SparklesIcon } from "@repo/ui/lucide";

import type { ArchitectureState } from "../../../auth/documents";

export const SummaryCard = ({ state }: { state: ArchitectureState }) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <SparklesIcon className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium">Summary</p>
        <span className="font-mono text-[11px] text-muted-foreground">
          v{state.version}
        </span>
      </div>
      <p className="px-5 py-4 text-sm leading-relaxed text-foreground/80 text-pretty">
        {state.summary}
      </p>
    </div>
  );
};
