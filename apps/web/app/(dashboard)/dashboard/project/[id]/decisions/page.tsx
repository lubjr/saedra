import { getDecisions } from "../../../../../../auth/documents";
import { getProjectSummary } from "../../../../../../auth/projects";
import { DecisionsBoard } from "../../../../../../components/project/decisions/DecisionsBoard";
import { DecisionsEmpty } from "../../../../../../components/project/decisions/DecisionsEmpty";
import { DecisionsHeader } from "../../../../../../components/project/decisions/DecisionsHeader";
import { DecisionsKpiStrip } from "../../../../../../components/project/decisions/DecisionsKpiStrip";
import { buildSupersededBy } from "../../../../../../components/project/decisions/helpers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [decisions, summary] = await Promise.all([
    getDecisions(id),
    getProjectSummary(id),
  ]);

  const sorted = [...decisions].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sorted.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-5">
        <DecisionsHeader summary={summary} />
        <DecisionsEmpty />
      </div>
    );
  }

  const supersededBy = buildSupersededBy(sorted);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <DecisionsHeader summary={summary} />
      <DecisionsKpiStrip decisions={sorted} />
      <DecisionsBoard decisions={sorted} supersededBy={supersededBy} />
    </div>
  );
}
