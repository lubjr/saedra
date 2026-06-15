import { SparklesIcon } from "@repo/ui/lucide";

import type { ArchitectureState } from "../../../auth/documents";

export const SummaryCard = ({ state }: { state: ArchitectureState }) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <SparklesIcon className="size-4 text-zinc-400" />
        <p className="text-sm font-medium">Summary</p>
        <span className="font-mono text-[11px] text-zinc-500">
          v{state.version}
        </span>
      </div>
      <p className="px-5 py-4 text-sm leading-relaxed text-zinc-300 text-pretty">
        {state.summary}
      </p>
    </div>
  );
};
