import { BookOpenIcon, SparklesIcon } from "@repo/ui/lucide";
import Link from "next/link";

import type { ArchitectureState } from "../../auth/documents";

interface Props {
  projectId: string;
  state: ArchitectureState | null;
}

export const ArchitectureStateCard = ({ projectId, state }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">Architecture State</p>
          {state && (
            <span className="font-mono text-[11px] text-muted-foreground">
              v{state.version}
            </span>
          )}
        </div>
        <Link
          href={`/dashboard/project/${projectId}/memory`}
          className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground/80 transition-colors"
        >
          <BookOpenIcon className="size-3" />
          Open memory
        </Link>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4 flex-1">
        {state ? (
          <>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {state.summary}
            </p>

            {state.core_principles.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2">
                  Core principles
                </p>
                <ul className="space-y-1.5">
                  {state.core_principles.map((p) => {
                    return (
                      <li key={p} className="flex items-start gap-2 text-sm">
                        <span className="size-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                        {p}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {state.constraints.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2">
                  Constraints
                </p>
                <ul className="space-y-1.5">
                  {state.constraints.map((c) => {
                    return (
                      <li key={c} className="flex items-start gap-2 text-sm">
                        <span className="size-1.5 rounded-full bg-status-warning mt-1.5 shrink-0" />
                        {c}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              No architecture state yet.
            </p>
            <code className="text-brand font-mono text-xs bg-brand-fill px-2 py-1.5 rounded self-start">
              saedra memory state update --ai
            </code>
          </div>
        )}
      </div>
    </div>
  );
};
