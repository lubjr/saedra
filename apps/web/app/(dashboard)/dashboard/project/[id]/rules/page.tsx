import { ShieldIcon } from "@repo/ui/lucide";

import { getViolationRules } from "../../../../../../auth/documents";

interface PageProps {
  params: Promise<{ id: string }>;
}

const severityColor: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const rules = await getViolationRules(id);

  if (rules.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">Rules</h1>
          <p className="text-sm text-muted-foreground">
            Violation rules enforced by the CLI.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <ShieldIcon className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400 mb-2">No rules defined yet.</p>
          <p className="text-sm text-zinc-500">
            Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra memory rule add
            </code>{" "}
            to define your first violation rule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Rules</h1>
        <p className="text-sm text-muted-foreground">
          Violation rules enforced by the CLI.
        </p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => {
          return (
            <div
              key={rule.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-2"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <span className="font-mono text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
                  {rule.id}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded border font-medium ${severityColor[rule.severity] ?? "bg-zinc-700 text-zinc-400"}`}
                >
                  {rule.severity} severity
                </span>
              </div>

              <p className="text-sm text-zinc-200">{rule.description}</p>

              {rule.related_decision && (
                <p className="text-xs text-zinc-500">
                  Related decision:{" "}
                  <span className="font-mono text-zinc-400">
                    {rule.related_decision}
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
