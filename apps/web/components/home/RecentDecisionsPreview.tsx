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
  active: "bg-teal-400",
  deprecated: "bg-zinc-500",
  superseded: "bg-yellow-400",
};

export const RecentDecisionsPreview = ({ hasMemory, decisions }: Props) => {
  const hasDecisions = decisions && decisions.length > 0;

  if (hasDecisions) {
    return (
      <ul className="flex flex-col divide-y divide-dashed divide-zinc-800">
        {decisions.map((dec) => {
          return (
            <li key={dec.id} className="flex items-start gap-3 py-3 first:pt-0">
              <span
                className={`size-1.5 rounded-full mt-2 shrink-0 ${statusDot[dec.status] ?? "bg-zinc-500"}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug truncate">
                  {dec.title}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  {formatRelativeDate(dec.created_at)} · {dec.status}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-zinc-500">
      <p>No decisions tracked yet.</p>
      {!hasMemory && (
        <p>
          Use{" "}
          <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
            saedra memory decision add
          </code>{" "}
          to record your first architecture decision.
        </p>
      )}
    </div>
  );
};
