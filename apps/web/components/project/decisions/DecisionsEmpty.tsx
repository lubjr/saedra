import { CheckCircle2Icon } from "@repo/ui/lucide";

const RECORD_CMD = "saedra memory decision add";

export const DecisionsEmpty = () => {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-14 flex flex-col items-center text-center">
      <span className="size-11 rounded-lg bg-teal-500/10 text-teal-400 grid place-items-center mb-4">
        <CheckCircle2Icon className="size-5" />
      </span>
      <h3 className="text-base font-semibold">No decisions recorded yet</h3>
      <p className="text-sm text-zinc-400 mt-1.5 max-w-md leading-relaxed">
        Run the CLI command to register your first architectural decision.
        Context, impact and constraints will populate the board above.
      </p>
      <code className="mt-5 font-mono text-xs bg-teal-500/10 text-teal-400 px-3 py-2 rounded-md">
        {RECORD_CMD}
      </code>
    </div>
  );
};
