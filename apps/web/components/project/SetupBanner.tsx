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
    <div className="flex items-center gap-3 rounded-xl border border-brand-stroke bg-brand-fill/60 px-4 py-3">
      <ZapIcon className="size-4 text-brand shrink-0" />
      <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-brand/80">Finish setup</span>
        <span className="text-xs font-mono text-muted-foreground">
          {done}/{total} done
        </span>
        <div className="flex gap-0.5">
          {checklist.map((item, i) => {
            return (
              <span
                key={i}
                className={`h-1 w-5 rounded-full ${item.done ? "bg-brand-solid" : "bg-muted"}`}
              />
            );
          })}
        </div>
        {next && (
          <span className="text-xs text-muted-foreground">
            Next:{" "}
            <code className="font-mono text-brand bg-brand-fill px-1.5 py-0.5 rounded">
              {next.hint}
            </code>
          </span>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="text-muted-foreground hover:text-foreground/80 transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
};
