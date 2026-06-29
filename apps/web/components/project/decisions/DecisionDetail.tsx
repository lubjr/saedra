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
            className={`text-xs px-2 py-0.5 rounded border font-medium ${STATUS_CLASSES[decision.status] ?? "bg-muted text-muted-foreground"}`}
          >
            {decision.status}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded border font-medium ${RISK_CLASSES[decision.risk_level] ?? "bg-muted text-muted-foreground"}`}
          >
            {decision.risk_level} risk
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-muted-foreground">
            {decision.id}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {formatFullDate(decision.created_at)}
          </span>
        </div>
        <h2 className="text-base font-semibold text-foreground leading-snug">
          {decision.title}
        </h2>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Context
        </p>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {decision.context}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Decision
        </p>
        <div className="rounded-lg bg-muted/40 p-4">
          <p className="text-sm text-foreground leading-relaxed">
            {decision.decision}
          </p>
        </div>
      </div>

      {decision.impact.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Impact
          </p>
          <ul className="space-y-1.5">
            {decision.impact.map((item, i) => {
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <ChevronRightIcon className="size-3.5 text-brand mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {decision.affects.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Affects
          </p>
          <div className="flex flex-wrap gap-1.5">
            {decision.affects.map((a) => {
              return (
                <span
                  key={a}
                  className="font-mono text-xs bg-muted border border-border-emphasis text-muted-foreground px-2 py-0.5 rounded"
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Constraints introduced
          </p>
          <div className="flex flex-wrap gap-1.5">
            {decision.constraints_introduced.map((c) => {
              return (
                <span
                  key={c}
                  className="text-xs bg-status-warning-fill text-status-warning border border-status-warning-stroke px-2 py-0.5 rounded"
                >
                  {c}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-4 flex flex-wrap items-center gap-3">
        {decision.supersedes && (
          <span className="font-mono text-[11px] text-muted-foreground">
            supersedes {decision.supersedes}
          </span>
        )}
        {supersededById ? (
          <span className="text-xs px-2 py-0.5 rounded border font-medium bg-status-warning-fill text-status-warning border-status-warning-stroke">
            superseded by {supersededById}
          </span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded border font-medium bg-brand-fill text-brand border-brand-stroke">
            in effect
          </span>
        )}
      </div>
    </div>
  );
};
