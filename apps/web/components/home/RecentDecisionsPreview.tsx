import { CheckCircle2Icon } from "@repo/ui/lucide";

import type { Decision } from "../../auth/documents";

interface Props {
  hasMemory: boolean;
  decisions?: Decision[];
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

const statusDot: Record<string, string> = {
  active: "bg-brand",
  deprecated: "bg-muted-foreground",
  superseded: "bg-status-warning",
};

const AddDecisionCta = () => {
  return (
    <div className="mt-auto pt-3 border-t border-border/60">
      <p className="text-[11px] text-muted-foreground">
        Add more with{" "}
        <code className="font-mono text-muted-foreground">
          saedra memory decision add
        </code>
      </p>
    </div>
  );
};

export const RecentDecisionsPreview = ({ hasMemory, decisions }: Props) => {
  const count = decisions?.length ?? 0;

  if (count === 0) {
    return (
      <div className="flex flex-col gap-3 flex-1">
        <div className="size-7 rounded-md bg-muted grid place-items-center">
          <CheckCircle2Icon className="size-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          No decisions tracked yet.
        </p>
        {!hasMemory && (
          <code className="text-brand font-mono text-xs bg-brand-fill px-2 py-1 rounded self-start">
            saedra memory decision add
          </code>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <ul className="flex flex-col divide-y divide-dashed divide-border">
        {decisions!.map((dec) => {
          return (
            <li key={dec.id} className="flex items-start gap-3 py-3 first:pt-0">
              <span
                className={`size-1.5 rounded-full mt-2 shrink-0 ${statusDot[dec.status] ?? "bg-muted-foreground"}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug truncate">
                  {dec.title}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  {formatRelativeDate(dec.created_at)} · {dec.status}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {count < 3 && <AddDecisionCta />}
    </div>
  );
};
