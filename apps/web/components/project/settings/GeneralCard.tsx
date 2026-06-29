import { Button } from "@repo/ui/button";
import { FileTextIcon, FolderIcon } from "@repo/ui/lucide";

import { SettingsCard } from "./SettingsCard";

const inputCls =
  "font-mono text-sm flex h-9 w-full rounded-md border border-border-emphasis bg-muted/30 px-3 py-1 text-foreground placeholder:text-muted-foreground/50 outline-none read-only:opacity-50 read-only:cursor-not-allowed transition";

const textareaCls =
  "text-sm flex w-full rounded-md border border-border-emphasis bg-muted/30 px-3 py-2 text-foreground placeholder:text-muted-foreground/50 outline-none resize-none read-only:opacity-50 read-only:cursor-not-allowed transition";

interface Props {
  initialName: string;
}

export const GeneralCard = ({ initialName }: Props) => {
  return (
    <SettingsCard
      icon={<FolderIcon className="size-4" />}
      title="General"
      desc="Name and description shown across the dashboard and CLI."
      footer={
        <>
          <span className="text-xs text-muted-foreground">
            Changes require CLI
          </span>
          <Button variant="brand" size="sm" disabled>
            Save changes
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <FolderIcon className="size-[14px]" /> Project name
          </label>
          <input className={inputCls} value={initialName} readOnly />
          <p className="text-xs text-muted-foreground">
            Used as the project identifier.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <FileTextIcon className="size-[14px]" /> Description
            <span className="inline-flex items-center rounded-md border border-border-emphasis bg-background text-muted-foreground px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              Optional
            </span>
          </label>
          <textarea
            rows={2}
            className={textareaCls}
            placeholder="No description set"
            readOnly
          />
        </div>
      </div>
    </SettingsCard>
  );
};
