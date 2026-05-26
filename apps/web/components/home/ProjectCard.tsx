import { Card } from "@repo/ui/card";
import { ClockIcon, FolderIcon } from "@repo/ui/lucide";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  created_at: string;
  has_memory: boolean;
}

const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link href={`/dashboard/project/${project.id}`} className="block">
      <Card className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700 hover:-translate-y-px transition rounded-xl cursor-pointer h-full p-0 py-0 gap-0 shadow-none">
        <div className="p-[18px] flex flex-col gap-3.5 h-full">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="size-7 rounded-md bg-teal-500/10 text-teal-400 grid place-items-center shrink-0">
              <FolderIcon className="size-4" />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1">
            <p className="text-[15px] font-semibold tracking-tight mb-1.5">
              {project.name}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
              <ClockIcon className="size-3" />
              <span>{formatRelativeDate(project.created_at)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
              <span className="size-1.5 rounded-full bg-zinc-700" />
              <span>no review yet</span>
              <span className="text-zinc-700">health</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
