import { ChevronRightIcon } from "@repo/ui/lucide";

import type { Decision } from "../../../auth/documents";
import { formatFullDate, RISK_CLASSES, STATUS_CLASSES } from "./helpers";

interface Props {
  decision: Decision;
  supersededBy: Record<string, string>;
}

export const DecisionDetail = ({ decision, supersededBy }: Props) => {
  const supersededById = supersededBy[decision.id];

  return (
    <div className="p-6 space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded border font-medium ${STATUS_CLASSES[decision.status] ?? "bg-zinc-700 text-zinc-400"}`}
          >
            {decision.status}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded border font-medium ${RISK_CLASSES[decision.risk_level] ?? "bg-zinc-700 text-zinc-400"}`}
          >
            {decision.risk_level} risk
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-zinc-500">
            {decision.id}
          </span>
          <span className="text-[11px] text-zinc-600">
            {formatFullDate(decision.created_at)}
          </span>
        </div>
        <h2 className="text-base font-semibold text-zinc-100 leading-snug">
          {decision.title}
        </h2>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Context
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {decision.context}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Decision
        </p>
        <div className="rounded-lg bg-zinc-800/40 p-4">
          <p className="text-sm text-zinc-200 leading-relaxed">
            {decision.decision}
          </p>
        </div>
      </div>

      {decision.impact.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Impact
          </p>
          <ul className="space-y-1.5">
            {decision.impact.map((item, i) => {
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <ChevronRightIcon className="size-3.5 text-teal-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {decision.affects.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Affects
          </p>
          <div className="flex flex-wrap gap-1.5">
            {decision.affects.map((a) => {
              return (
                <span
                  key={a}
                  className="font-mono text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded"
                >
                  {a}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {decision.constraints_introduced.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Constraints introduced
          </p>
          <div className="flex flex-wrap gap-1.5">
            {decision.constraints_introduced.map((c) => {
              return (
                <span
                  key={c}
                  className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded"
                >
                  {c}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-zinc-800 pt-4 flex flex-wrap items-center gap-3">
        {decision.supersedes && (
          <span className="font-mono text-[11px] text-zinc-500">
            supersedes {decision.supersedes}
          </span>
        )}
        {supersededById ? (
          <span className="text-xs px-2 py-0.5 rounded border font-medium bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            superseded by {supersededById}
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded border font-medium bg-teal-500/10 text-teal-400 border-teal-500/20">
            in effect
          </span>
        )}
      </div>
    </div>
  );
};
