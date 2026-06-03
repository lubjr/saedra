import { getDecisions } from "../../../../../../auth/documents";
import { getProjectSummary } from "../../../../../../auth/projects";
import { getProjectReviews } from "../../../../../../auth/reviews";
import { MetricsClient } from "../../../../../../components/project/metrics/MetricsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [summary, reviews, decisions] = await Promise.all([
    getProjectSummary(id),
    getProjectReviews(id),
    getDecisions(id),
  ]);

  const projectName = summary?.name ?? "Project";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <MetricsClient
        projectName={projectName}
        summary={summary}
        reviews={reviews}
        decisions={decisions}
      />
    </div>
  );
}
