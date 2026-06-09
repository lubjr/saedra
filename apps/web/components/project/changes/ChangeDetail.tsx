import { FileCode2Icon } from "@repo/ui/lucide";

import type { ChangeEvent } from "../../../auth/documents";
import { formatFullDate, formatRelativeDate } from "../decisions/helpers";
import { inferRisk, RISK_CLASSES } from "./helpers";

const RECORD_CMD = "saedra memory change log --from-git";

interface Props {
  change: ChangeEvent;
}

export const ChangeDetail = ({ change }: Props) => {
  const risk = inferRisk(change.risk_assessment);

  return (
    <div className="p-6 space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded border font-medium ${RISK_CLASSES[risk]}`}
          >
            {risk} risk
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border font-medium bg-zinc-800/60 text-zinc-400 border-zinc-700">
            <FileCode2Icon className="size-3" />
            {change.files_changed.length} files
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-zinc-500">
            {change.id}
          </span>
          <span className="text-[11px] text-zinc-600">
            {formatFullDate(change.created_at)} ·{" "}
            {formatRelativeDate(change.created_at)}
          </span>
        </div>
        <h2 className="text-base font-semibold text-zinc-100 leading-snug">
          {change.summary}
        </h2>
      </div>

      {change.architectural_impact && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Architectural impact
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {change.architectural_impact}
          </p>
        </div>
      )}

      {change.risk_assessment && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Risk assessment
          </p>
          <div className="rounded-lg bg-zinc-800/40 p-4">
            <p className="text-sm text-zinc-200 leading-relaxed">
              {change.risk_assessment}
            </p>
          </div>
        </div>
      )}

      {change.files_changed.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Files changed
          </p>
          <div className="flex flex-col gap-1">
            {change.files_changed.map((f) => {
              return (
                <div
                  key={f}
                  className="flex items-center gap-2 font-mono text-xs text-zinc-400 bg-zinc-800/40 border border-zinc-700/50 rounded px-2.5 py-1.5"
                >
                  <FileCode2Icon className="size-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {change.related_decisions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Related decisions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {change.related_decisions.map((d) => {
              return (
                <span
                  key={d}
                  className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded"
                >
                  {d}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-zinc-800 pt-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[11px] text-zinc-500">logged via</span>
        <code className="font-mono text-[11px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded">
          {RECORD_CMD}
        </code>
      </div>
    </div>
  );
};
