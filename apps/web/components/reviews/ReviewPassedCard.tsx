import { CheckCircle2Icon } from "@repo/ui/lucide";

import type { FileResult } from "../../auth/reviews";

interface Props {
  files: FileResult[];
}

export const ReviewPassedCard = ({ files }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <CheckCircle2Icon className="size-4 text-brand" />
        <p className="text-sm font-medium">Passed</p>
        <span className="font-mono text-[11px] text-brand">{files.length}</span>
      </div>
      <ul className="divide-y divide-dashed divide-border">
        {files.map((f) => {
          return (
            <li key={f.file} className="px-5 py-3 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand shrink-0" />
              <code className="font-mono text-xs text-muted-foreground break-all">
                {f.file}
              </code>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
