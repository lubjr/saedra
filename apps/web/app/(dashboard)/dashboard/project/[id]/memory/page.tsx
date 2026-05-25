import { SparklesIcon } from "@repo/ui/lucide";

import { getArchitectureState } from "../../../../../../auth/documents";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const state = await getArchitectureState(id);

  if (!state) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">Memory</h1>
          <p className="text-sm text-muted-foreground">
            Architecture state recorded by the CLI.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <SparklesIcon className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400 mb-2">
            No architecture state recorded yet.
          </p>
          <p className="text-sm text-zinc-500">
            Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra memory state update --ai
            </code>{" "}
            to generate the first snapshot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Memory</h1>
        <p className="text-sm text-muted-foreground">
          Architecture state recorded by the CLI.
        </p>
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-1">
        <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
          Summary
        </p>
        <p className="text-sm text-zinc-200">{state.summary}</p>
      </div>

      {state.core_principles.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Core Principles
          </p>
          <ul className="space-y-1.5">
            {state.core_principles.map((p, i) => {
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" />
                  {p}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {state.critical_paths.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Critical Paths
          </p>
          <ul className="space-y-1.5">
            {state.critical_paths.map((p, i) => {
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  {p}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {state.constraints.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Constraints
          </p>
          <ul className="space-y-1.5">
            {state.constraints.map((c, i) => {
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                  {c}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {state.active_decisions.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-3">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            Active Decisions
          </p>
          <div className="flex flex-wrap gap-2">
            {state.active_decisions.map((d) => {
              return (
                <span
                  key={d}
                  className="font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700"
                >
                  {d}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
