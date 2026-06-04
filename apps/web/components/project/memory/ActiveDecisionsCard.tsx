import { ArrowUpRightIcon, FileTextIcon } from "@repo/ui/lucide";
import Link from "next/link";

interface ActiveDecision {
  id: string;
  title: string;
}

interface Props {
  projectId: string;
  decisions: ActiveDecision[];
}

export const ActiveDecisionsCard = ({ projectId, decisions }: Props) => {
  if (decisions.length === 0) return null;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FileTextIcon className="size-4 text-zinc-400" />
          <p className="text-sm font-medium">Active decisions</p>
          <span className="font-mono text-[11px] text-zinc-500">
            {decisions.length}
          </span>
        </div>
        <Link
          href={`/dashboard/project/${projectId}/decisions`}
          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          view all →
        </Link>
      </div>
      <ul className="px-5 py-1 divide-y divide-dashed divide-zinc-800">
        {decisions.map((d) => {
          const resolved = d.title !== d.id;
          return (
            <li key={d.id}>
              <Link
                href={`/dashboard/project/${projectId}/decisions`}
                className="group flex items-center gap-3 py-3 transition-colors"
              >
                <span className="size-1.5 rounded-full bg-teal-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100 leading-snug transition-colors">
                    {d.title}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                    {resolved ? `${d.id} · active` : "active"}
                  </p>
                </div>
                <ArrowUpRightIcon className="size-3.5 text-zinc-600 group-hover:text-teal-400 transition-colors shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
