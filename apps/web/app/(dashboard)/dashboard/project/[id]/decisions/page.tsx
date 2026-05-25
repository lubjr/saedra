import { CheckCircle2Icon } from "@repo/ui/lucide";

import { getDecisions } from "../../../../../../auth/documents";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusColor: Record<string, string> = {
  active: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  deprecated: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
  superseded: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const riskColor: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
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
  const decisions = await getDecisions(id);

  const sorted = [...decisions].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sorted.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight py-2">Decisions</h1>
          <p className="text-sm text-muted-foreground">
            Architectural decisions recorded by the CLI.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <CheckCircle2Icon className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400 mb-2">
            No decisions recorded yet.
          </p>
          <p className="text-sm text-zinc-500">
            Run{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra memory decision add
            </code>{" "}
            to register your first architectural decision.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">Decisions</h1>
        <p className="text-sm text-muted-foreground">
          Architectural decisions recorded by the CLI.
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map((dec) => {
          return (
            <div
              key={dec.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <h2 className="text-sm font-medium text-zinc-100">
                  {dec.title}
                </h2>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border font-medium ${statusColor[dec.status] ?? "bg-zinc-700 text-zinc-400"}`}
                  >
                    {dec.status}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border font-medium ${riskColor[dec.risk_level] ?? "bg-zinc-700 text-zinc-400"}`}
                  >
                    {dec.risk_level} risk
                  </span>
                </div>
              </div>

              <p className="text-sm text-zinc-400">{dec.context}</p>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                {dec.affects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {dec.affects.map((a) => {
                      return (
                        <span
                          key={a}
                          className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700"
                        >
                          {a}
                        </span>
                      );
                    })}
                  </div>
                )}
                <span className="text-xs text-zinc-600 ml-auto">
                  {formatDate(dec.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
