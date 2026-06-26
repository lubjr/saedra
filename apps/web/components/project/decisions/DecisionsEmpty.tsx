import { CheckCircle2Icon } from "@repo/ui/lucide";

const RECORD_CMD = "saedra memory decision add";

export const DecisionsEmpty = () => {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-14 flex flex-col items-center text-center">
      <span className="size-11 rounded-lg bg-brand-fill text-brand grid place-items-center mb-4">
        <CheckCircle2Icon className="size-5" />
      </span>
      <h3 className="text-base font-semibold">No decisions recorded yet</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
        Run the CLI command to register your first architectural decision.
        Context, impact and constraints will populate the board above.
      </p>
      <code className="mt-5 font-mono text-xs bg-brand-fill text-brand px-3 py-2 rounded-md">
        {RECORD_CMD}
      </code>
    </div>
  );
};
