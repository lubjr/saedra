import { CheckCircle2Icon } from "@repo/ui/lucide";
import Link from "next/link";

import type { Decision } from "../../../auth/documents";

interface Props {
  projectId: string;
  decisions: Decision[];
  range: string;
}

const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
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

const riskBadge: Record<string, string> = {
  high: "bg-status-error-fill text-status-error border-status-error-stroke",
  medium:
    "bg-status-warning-fill text-status-warning border-status-warning-stroke",
  low: "bg-brand-fill text-brand border-brand-stroke",
};

export const DecisionTimelineCard = ({
  projectId,
  decisions,
  range,
}: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CheckCircle2Icon className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">Decision timeline</p>
          <span className="font-mono text-[11px] text-muted-foreground">
            {decisions.length} decisions · {range}
          </span>
        </div>
        <Link
          href={`/dashboard/project/${projectId}/decisions`}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground/80 transition-colors"
        >
          view all →
        </Link>
      </div>

      <div className="px-5 py-1 flex-1">
        {decisions.length > 0 ? (
          <ul className="divide-y divide-dashed divide-border">
            {decisions.map((dec) => {
              return (
                <li key={dec.id} className="flex items-start gap-3 py-3">
                  <span
                    className={`size-1.5 rounded-full mt-2 shrink-0 ${statusDot[dec.status] ?? "bg-muted-foreground"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">
                      {dec.title}
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {dec.id} · {formatRelativeDate(dec.created_at)} ·{" "}
                      {dec.status}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${riskBadge[dec.risk_level]}`}
                  >
                    {dec.risk_level}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col gap-3 py-4">
            <p className="text-sm text-muted-foreground">
              No decisions tracked yet.
            </p>
            <code className="text-brand font-mono text-xs bg-brand-fill px-2 py-1.5 rounded self-start">
              saedra memory decision add
            </code>
          </div>
        )}
      </div>
    </div>
  );
};
