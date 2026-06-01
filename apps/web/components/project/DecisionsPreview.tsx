import { CheckCircle2Icon } from "@repo/ui/lucide";
import Link from "next/link";

import type { Decision } from "../../auth/documents";

interface Props {
  projectId: string;
  decisions: Decision[];
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
  active: "bg-teal-400",
  deprecated: "bg-zinc-500",
  superseded: "bg-yellow-400",
};

const riskBadge: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

export const DecisionsPreview = ({ projectId, decisions }: Props) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <CheckCircle2Icon className="size-4 text-zinc-400" />
          <p className="text-sm font-medium">Recent decisions</p>
        </div>
        <Link
          href={`/dashboard/project/${projectId}/decisions`}
          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          view all →
        </Link>
      </div>

      <div className="px-5 py-1 flex-1">
        {decisions.length > 0 ? (
          <ul className="divide-y divide-dashed divide-zinc-800">
            {decisions.map((dec) => {
              return (
                <li key={dec.id} className="flex items-start gap-3 py-3">
                  <span
                    className={`size-1.5 rounded-full mt-2 shrink-0 ${statusDot[dec.status] ?? "bg-zinc-500"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug truncate">
                      {dec.title}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
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
            <p className="text-sm text-zinc-500">No decisions tracked yet.</p>
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-2 py-1.5 rounded self-start">
              saedra memory decision add
            </code>
          </div>
        )}
      </div>
    </div>
  );
};
