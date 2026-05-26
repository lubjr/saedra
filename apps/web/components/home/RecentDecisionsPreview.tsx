import { ArrowUpRightIcon } from "@repo/ui/lucide";
import Link from "next/link";

interface Props {
  projectId: string;
  hasMemory: boolean;
}

export const RecentDecisionsPreview = ({ projectId, hasMemory }: Props) => {
  return (
    <div className="bg-zinc-950 p-6 flex flex-col min-h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Recent decisions
        </p>
        {hasMemory && (
          <Link
            href={`/dashboard/project/${projectId}/decisions`}
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowUpRightIcon className="size-3" />
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-zinc-500">
        <p>No decisions tracked yet.</p>
        <p>
          Use{" "}
          <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
            saedra memory decision add
          </code>{" "}
          to record your first architecture decision.
        </p>
      </div>
    </div>
  );
};
