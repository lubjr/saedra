import { FolderIcon } from "@repo/ui/lucide";
import Link from "next/link";

export type FolderKey = "decisions" | "changes" | "rules";

const PILLS: { key: FolderKey; label: string }[] = [
  { key: "decisions", label: "Decisions" },
  { key: "changes", label: "Changes" },
  { key: "rules", label: "Rules" },
];

interface Props {
  projectId: string;
  active: FolderKey | null;
  counts: Record<FolderKey, number>;
  disabled?: boolean;
}

export const FolderPills = ({ projectId, active, counts, disabled }: Props) => {
  const basePath = `/dashboard/project/${projectId}/memory`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PILLS.map(({ key, label }) => {
        const isActive = active === key;
        const className = `inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium border transition-colors ${
          disabled
            ? "bg-background border-border text-muted-foreground opacity-40 cursor-not-allowed"
            : isActive
              ? "bg-brand-fill border-brand-stroke text-brand"
              : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-border-emphasis"
        }`;

        const content = (
          <>
            <FolderIcon className="size-3.5" />
            {label}
            <span className="font-mono text-[11px] opacity-70">
              {counts[key]}
            </span>
          </>
        );

        if (disabled) {
          return (
            <span key={key} aria-disabled className={className}>
              {content}
            </span>
          );
        }

        return (
          <Link
            key={key}
            href={isActive ? basePath : `${basePath}?folder=${key}`}
            scroll={false}
            className={className}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
};
