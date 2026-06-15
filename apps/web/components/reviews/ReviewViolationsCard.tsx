import { ShieldIcon } from "@repo/ui/lucide";

import type { FileResult } from "../../auth/reviews";

interface Props {
  files: FileResult[];
}

export const ReviewViolationsCard = ({ files }: Props) => {
  return (
    <div className="rounded-xl border border-red-500/20 bg-zinc-900 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-red-500/20">
        <ShieldIcon className="size-4 text-red-400" />
        <p className="text-sm font-medium">Violations</p>
        <span className="font-mono text-[11px] text-red-400">
          {files.length}
        </span>
      </div>
      <ul className="divide-y divide-dashed divide-zinc-800">
        {files.map((f) => {
          return (
            <li key={f.file} className="px-5 py-3.5 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <code className="font-mono text-xs text-zinc-300 break-all">
                  {f.file}
                </code>
              </div>
              {f.note && (
                <p className="text-xs text-zinc-500 pl-3.5">{f.note}</p>
              )}
              {f.violations.length > 0 && (
                <ul className="pl-3.5 flex flex-col gap-1.5">
                  {f.violations.map((v, i) => {
                    return (
                      <li key={i} className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 rounded-md px-1.5 py-0.5 self-start">
                          {v.rule_id}
                        </span>
                        <p className="text-xs text-zinc-400">{v.detail}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
