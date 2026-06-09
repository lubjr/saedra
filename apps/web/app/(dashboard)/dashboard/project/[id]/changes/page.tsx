import { getRecentChanges } from "../../../../../../auth/documents";
import { getProjectSummary } from "../../../../../../auth/projects";
import { ChangesBoard } from "../../../../../../components/project/changes/ChangesBoard";
import { ChangesEmpty } from "../../../../../../components/project/changes/ChangesEmpty";
import { ChangesHeader } from "../../../../../../components/project/changes/ChangesHeader";
import { ChangesKpiStrip } from "../../../../../../components/project/changes/ChangesKpiStrip";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [changes, summary] = await Promise.all([
    getRecentChanges(id, 50),
    getProjectSummary(id),
  ]);

  const seen = new Set<string>();
  const sorted = [...changes]
    .sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

  if (sorted.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-5">
        <ChangesHeader summary={summary} />
        <ChangesEmpty />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <ChangesHeader summary={summary} />
      <ChangesKpiStrip changes={sorted} />
      <ChangesBoard changes={sorted} />
    </div>
  );
}
