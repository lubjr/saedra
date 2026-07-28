import { Link2Icon } from "@repo/ui/lucide";

import type { ViolationRule } from "../../../auth/documents";
import { formatFullDate } from "../decisions/helpers";
import { SEVERITY_CLASSES, SEVERITY_LABEL } from "./helpers";

interface Props {
  rule: ViolationRule;
}

export const RuleDetail = ({ rule }: Props) => {
  return (
    <div className="p-6 space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded border font-medium ${SEVERITY_CLASSES[rule.severity]}`}
          >
            {SEVERITY_LABEL[rule.severity]} severity
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-muted-foreground">
            {rule.id}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {formatFullDate(rule.created_at)}
          </span>
        </div>
        <h2 className="text-base font-semibold text-foreground leading-snug">
          {rule.description}
        </h2>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Linked decision
        </p>
        {rule.related_decision ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-brand bg-brand-fill border border-brand-stroke px-2.5 py-1 rounded">
            <Link2Icon className="size-3" />
            {rule.related_decision}
          </span>
        ) : (
          <span className="font-mono text-xs text-muted-foreground">
            no linked decision
          </span>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <span className="font-mono text-[11px] text-muted-foreground">
          enforced since {formatFullDate(rule.created_at)}
        </span>
      </div>
    </div>
  );
};
