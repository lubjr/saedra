import { CheckCircle2Icon } from "@repo/ui/lucide";

import type { FileResult } from "../../auth/reviews";

interface Props {
  files: FileResult[];
}

export const ReviewPassedCard = ({ files }: Props) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <CheckCircle2Icon className="size-4 text-teal-400" />
        <p className="text-sm font-medium">Passed</p>
        <span className="font-mono text-[11px] text-teal-400">
          {files.length}
        </span>
      </div>
      <ul className="divide-y divide-dashed divide-zinc-800">
        {files.map((f) => {
          return (
            <li key={f.file} className="px-5 py-3 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-teal-400 shrink-0" />
              <code className="font-mono text-xs text-zinc-500 break-all">
                {f.file}
              </code>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
