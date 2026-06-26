import { ClockIcon } from "@repo/ui/lucide";

const RECORD_CMD = "saedra memory change log --from-git";

export const ChangesEmpty = () => {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-14 flex flex-col items-center text-center">
      <span className="size-11 rounded-lg bg-brand-fill text-brand grid place-items-center mb-4">
        <ClockIcon className="size-5" />
      </span>
      <h3 className="text-base font-semibold">No changes recorded yet</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
        Run the CLI command to register your first architectural change event.
        Impact, risk assessment and touched files will populate the board above.
      </p>
      <code className="mt-5 font-mono text-xs bg-brand-fill text-brand px-3 py-2 rounded-md">
        {RECORD_CMD}
      </code>
    </div>
  );
};
