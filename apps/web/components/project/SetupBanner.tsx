"use client";

import { XIcon, ZapIcon } from "@repo/ui/lucide";
import * as React from "react";

interface ChecklistItem {
  label: string;
  done: boolean;
  hint: string | null;
}

interface Props {
  projectId: string;
  checklist: ChecklistItem[];
}

export const ProjectSetupBanner = ({ projectId, checklist }: Props) => {
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    setDismissed(
      localStorage.getItem(`saedra:setup-dismissed:${projectId}`) === "true",
    );
  }, [projectId]);

  if (dismissed) return null;

  const done = checklist.filter((i) => {
    return i.done;
  }).length;
  const total = checklist.length;
  const next = checklist.find((i) => {
    return !i.done;
  });

  const handleDismiss = () => {
    localStorage.setItem(`saedra:setup-dismissed:${projectId}`, "true");
    setDismissed(true);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-teal-500/20 bg-teal-500/[0.06] px-4 py-3">
      <ZapIcon className="size-4 text-teal-400 shrink-0" />
      <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-teal-300">Finish setup</span>
        <span className="text-xs font-mono text-zinc-500">
          {done}/{total} done
        </span>
        <div className="flex gap-0.5">
          {checklist.map((item, i) => {
            return (
              <span
                key={i}
                className={`h-1 w-5 rounded-full ${item.done ? "bg-teal-500" : "bg-zinc-700"}`}
              />
            );
          })}
        </div>
        {next && (
          <span className="text-xs text-zinc-400">
            Next:{" "}
            <code className="font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
              {next.hint}
            </code>
          </span>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
};
