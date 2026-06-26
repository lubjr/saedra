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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileTextIcon className="size-4 text-muted-foreground" />
          <p className="text-sm font-medium">Active decisions</p>
          <span className="font-mono text-[11px] text-muted-foreground">
            {decisions.length}
          </span>
        </div>
        <Link
          href={`/dashboard/project/${projectId}/decisions`}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground/80 transition-colors"
        >
          view all →
        </Link>
      </div>
      <ul className="px-5 py-1 divide-y divide-dashed divide-border">
        {decisions.map((d) => {
          const resolved = d.title !== d.id;
          return (
            <li key={d.id}>
              <Link
                href={`/dashboard/project/${projectId}/decisions`}
                className="group flex items-center gap-3 py-3 transition-colors"
              >
                <span className="size-1.5 rounded-full bg-brand shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-foreground leading-snug transition-colors">
                    {d.title}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {resolved ? `${d.id} · active` : "active"}
                  </p>
                </div>
                <ArrowUpRightIcon className="size-3.5 text-muted-foreground group-hover:text-brand transition-colors shrink-0" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
