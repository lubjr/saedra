import { ClockIcon } from "@repo/ui/lucide";

import { getRecentChanges } from "../../../../../../auth/documents";

interface PageProps {
  params: Promise<{ id: string }>;
}

const riskColor: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

const inferRisk = (assessment: string): string => {
  const lower = assessment.toLowerCase();
  if (lower.includes("high")) return "high";
  if (lower.includes("medium")) return "medium";
  return "low";
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const changes = await getRecentChanges(id, 50);

  if (changes.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">Changes</h1>
          <p className="text-sm text-muted-foreground">
            Architectural change events recorded by the CLI.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <ClockIcon className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400 mb-2">No changes recorded yet.</p>
          <p className="text-sm text-zinc-500">
            Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra memory change log
            </code>{" "}
            to register your first change event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Changes</h1>
        <p className="text-sm text-muted-foreground">
          Architectural change events recorded by the CLI.
        </p>
      </div>

      <div className="relative space-y-0">
        {changes.map((change, index) => {
          const risk = inferRisk(change.risk_assessment);
          return (
            <div key={`${change.id}-${index}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="mt-5 h-2.5 w-2.5 rounded-full bg-teal-400 shrink-0 ring-4 ring-zinc-950" />
                {index < changes.length - 1 && (
                  <div className="w-px flex-1 bg-zinc-800" />
                )}
              </div>

              <div className="pb-6 flex-1 min-w-0">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <p className="text-sm font-medium text-zinc-100">
                      {change.summary}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded border font-medium ${riskColor[risk]}`}
                      >
                        {risk} risk
                      </span>
                      <span className="text-xs text-zinc-600">
                        {formatDate(change.created_at)}
                      </span>
                    </div>
                  </div>

                  {change.architectural_impact && (
                    <p className="text-sm text-zinc-400">
                      {change.architectural_impact}
                    </p>
                  )}

                  {change.files_changed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {change.files_changed.map((f) => {
                        return (
                          <span
                            key={f}
                            className="font-mono text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700"
                          >
                            {f}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {change.related_decisions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {change.related_decisions.map((d) => {
                        return (
                          <span
                            key={d}
                            className="text-xs bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20"
                          >
                            {d}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
