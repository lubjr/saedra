"use client";

import { Button } from "@repo/ui/button";
import { CopyIcon, SparklesIcon } from "@repo/ui/lucide";
import { toast } from "sonner";

const UPDATE_CMD = "saedra memory state update --ai";
const KPI_LABELS = [
  "State version",
  "Core principles",
  "Critical paths",
  "Constraints",
];

export const MemoryEmpty = () => {
  const handleCopy = () => {
    void navigator.clipboard.writeText(UPDATE_CMD);
    toast.success("Copied to clipboard");
  };
  const handleRun = () => {
    toast.info(`Run '${UPDATE_CMD}' in your terminal to refresh memory.`);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {KPI_LABELS.map((label) => {
          return (
            <div
              key={label}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {label}
              </p>
              <p className="text-3xl font-mono font-semibold text-zinc-600">
                —
              </p>
              <p className="text-[11px] font-mono text-zinc-500">no snapshot</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-14 flex flex-col items-center text-center">
        <span className="size-11 rounded-lg bg-teal-500/10 text-teal-400 grid place-items-center mb-4">
          <SparklesIcon className="size-5" />
        </span>
        <h3 className="text-base font-semibold">
          No architecture state recorded yet
        </h3>
        <p className="text-sm text-zinc-400 mt-1.5 max-w-md leading-relaxed">
          Run the snapshot command to generate the first version. Principles,
          critical paths and constraints will populate the panel above.
        </p>
        <code className="mt-5 font-mono text-xs bg-teal-500/10 text-teal-400 px-3 py-2 rounded-md">
          {UPDATE_CMD}
        </code>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <CopyIcon className="size-3.5" /> Copy command
          </Button>
          <Button variant="brand" size="sm" onClick={handleRun}>
            <SparklesIcon className="size-4" /> Run update
          </Button>
        </div>
      </div>
    </>
  );
};
