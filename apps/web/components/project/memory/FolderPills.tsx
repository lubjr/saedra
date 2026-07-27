"use client";

import { FolderIcon } from "@repo/ui/lucide";

export type FolderKey = "decisions" | "changes" | "rules";

const PILLS: { key: FolderKey; label: string }[] = [
  { key: "decisions", label: "Decisions" },
  { key: "changes", label: "Changes" },
  { key: "rules", label: "Rules" },
];

interface Props {
  active: FolderKey | null;
  counts: Record<FolderKey, number>;
  disabled?: boolean;
  onSelect: (key: FolderKey) => void;
}

export const FolderPills = ({ active, counts, disabled, onSelect }: Props) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PILLS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => {
              onSelect(key);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium border transition-colors ${
              disabled
                ? "bg-background border-border text-muted-foreground opacity-40 cursor-not-allowed"
                : isActive
                  ? "bg-brand-fill border-brand-stroke text-brand"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-border-emphasis"
            }`}
          >
            <FolderIcon className="size-3.5" />
            {label}
            <span className="font-mono text-[11px] opacity-70">
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
