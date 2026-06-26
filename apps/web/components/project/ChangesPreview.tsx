import { ClockIcon } from "@repo/ui/lucide";
import Link from "next/link";

import type { ChangeEvent } from "../../auth/documents";

interface Props {
  projectId: string;
  changes: ChangeEvent[];
}

const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

export const ChangesPreview = ({ projectId, changes }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ClockIcon className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">Recent changes</p>
        </div>
        <Link
          href={`/dashboard/project/${projectId}/changes`}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground/80 transition-colors"
        >
          view all →
        </Link>
      </div>

      <div className="px-5 py-2 flex-1">
        {changes.length > 0 ? (
          <div className="flex flex-col">
            {changes.map((chg, i) => {
              return (
                <div key={chg.id} className="flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="size-2 rounded-full bg-brand mt-3" />
                    {i < changes.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>
                  <div className="pb-4 min-w-0">
                    <p className="text-sm font-medium leading-snug pt-2">
                      {chg.summary}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {formatRelativeDate(chg.created_at)}
                      {chg.files_changed.length > 0 && (
                        <>
                          {" · "}
                          {chg.files_changed.slice(0, 2).join(", ")}
                          {chg.files_changed.length > 2 &&
                            ` +${chg.files_changed.length - 2}`}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-4">
            <p className="text-sm text-muted-foreground">
              No changes logged yet.
            </p>
            <code className="text-brand font-mono text-xs bg-brand-fill px-2 py-1.5 rounded self-start">
              saedra memory change log --from-git
            </code>
          </div>
        )}
      </div>
    </div>
  );
};
