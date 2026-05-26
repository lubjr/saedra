import { ArrowUpRightIcon, CheckCircle2Icon } from "@repo/ui/lucide";
import Link from "next/link";

import type { Decision } from "../../auth/documents";

interface Props {
  projectId: string;
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

const statusColor: Record<string, string> = {
  active: "bg-teal-400",
  deprecated: "bg-zinc-500",
  superseded: "bg-yellow-400",
};

export const RecentDecisionsPreview = ({ projectId, hasMemory, decisions }: Props) => {
  const hasDecisions = decisions && decisions.length > 0;

  return (
    <div className="bg-zinc-950 p-6 flex flex-col min-h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Recent decisions
        </p>
        {hasDecisions && (
          <Link
            href={`/dashboard/project/${projectId}/decisions`}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowUpRightIcon className="size-3" />
          </Link>
        )}
      </div>

      {hasDecisions ? (
        <ul className="flex flex-col divide-y divide-dashed divide-zinc-800">
          {decisions.map((dec) => (
            <li key={dec.id} className="flex items-start gap-3 py-3 first:pt-0">
              <span
                className={`size-1.5 rounded-full mt-2 shrink-0 ${statusColor[dec.status] ?? "bg-zinc-500"}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug truncate">{dec.title}</p>
                <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  {formatRelativeDate(dec.created_at)} · {dec.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-2 text-sm text-zinc-500">
          {hasMemory ? (
            <>
              <CheckCircle2Icon className="size-5 text-zinc-700 mb-1" />
              <p>No decisions tracked yet.</p>
            </>
          ) : (
            <>
              <p>No decisions tracked yet.</p>
              <p>
                Use{" "}
                <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                  saedra memory decision add
                </code>{" "}
                to record your first architecture decision.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
