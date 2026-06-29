import { ClockIcon } from "@repo/ui/lucide";

import type { FileResult } from "../../auth/reviews";

interface Props {
  files: FileResult[];
}

export const ReviewWarningsCard = ({ files }: Props) => {
  return (
    <div className="rounded-xl border border-status-warning-stroke bg-card flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-status-warning-stroke">
        <ClockIcon className="size-4 text-status-warning" />
        <p className="text-sm font-medium">Warnings</p>
        <span className="font-mono text-[11px] text-status-warning">
          {files.length}
        </span>
      </div>
      <ul className="divide-y divide-dashed divide-border">
        {files.map((f) => {
          return (
            <li key={f.file} className="px-5 py-3.5 flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-status-warning mt-1.5 shrink-0" />
                <code className="font-mono text-xs text-foreground/80 break-all">
                  {f.file}
                </code>
              </div>
              {f.note && (
                <p className="text-xs text-muted-foreground pl-3.5">{f.note}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
