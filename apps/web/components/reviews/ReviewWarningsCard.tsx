import { ClockIcon } from "@repo/ui/lucide";

import type { FileResult } from "../../auth/reviews";

interface Props {
  files: FileResult[];
}

export const ReviewWarningsCard = ({ files }: Props) => {
  return (
    <div className="rounded-xl border border-yellow-500/20 bg-zinc-900 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-yellow-500/20">
        <ClockIcon className="size-4 text-yellow-400" />
        <p className="text-sm font-medium">Warnings</p>
        <span className="font-mono text-[11px] text-yellow-400">
          {files.length}
        </span>
      </div>
      <ul className="divide-y divide-dashed divide-zinc-800">
        {files.map((f) => {
          return (
            <li key={f.file} className="px-5 py-3.5 flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                <code className="font-mono text-xs text-zinc-300 break-all">
                  {f.file}
                </code>
              </div>
              {f.note && (
                <p className="text-xs text-zinc-500 pl-3.5">{f.note}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
