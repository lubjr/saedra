import { ArrowRightIcon, ClockIcon, Link2Icon } from "@repo/ui/lucide";

import type { ViolationRule } from "../../../auth/documents";
import { formatRelativeDate } from "../decisions/helpers";
import { SEVERITY_CLASSES, SEVERITY_DOT, SEVERITY_LABEL } from "./helpers";

interface Props {
  rule: ViolationRule;
}

export const RuleCard = ({ rule }: Props) => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <span className="font-mono text-xs text-zinc-300 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
          {rule.id}
        </span>
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${SEVERITY_CLASSES[rule.severity]}`}
          >
            <span
              className={`size-1.5 rounded-full ${SEVERITY_DOT[rule.severity]}`}
            />
            {SEVERITY_LABEL[rule.severity]} severity
          </span>
          <span className="font-mono text-[11px] text-zinc-500 flex items-center gap-1">
            <ClockIcon className="size-3" />
            {formatRelativeDate(rule.created_at)}
          </span>
        </div>
      </div>

      <p className="text-sm text-zinc-200 leading-relaxed max-w-3xl">
        {rule.description}
      </p>

      <div className="pt-1">
        {rule.related_decision ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-teal-400 transition-colors cursor-pointer">
            <Link2Icon className="size-3" />
            {rule.related_decision}
            <ArrowRightIcon className="size-3" />
          </span>
        ) : (
          <span className="font-mono text-xs text-zinc-600">
            no linked decision
          </span>
        )}
      </div>
    </div>
  );
};
