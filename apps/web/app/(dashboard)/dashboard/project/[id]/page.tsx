import {
  getArchitectureState,
  getDecisions,
  getRecentChanges,
  getViolationRules,
} from "../../../../../auth/documents";
import { getProjectSummary } from "../../../../../auth/projects";
import { getProjectReviews } from "../../../../../auth/reviews";
import { ArchitectureStateCard } from "../../../../../components/project/ArchitectureStateCard";
import { ChangesPreview } from "../../../../../components/project/ChangesPreview";
import { DecisionsPreview } from "../../../../../components/project/DecisionsPreview";
import { KpiStrip } from "../../../../../components/project/KpiStrip";
import { OverviewHeader } from "../../../../../components/project/OverviewHeader";
import { ProjectSetupBanner } from "../../../../../components/project/SetupBanner";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [architectureState, decisions, rules, changes, summary, reviews] =
    await Promise.all([
      getArchitectureState(id),
      getDecisions(id),
      getViolationRules(id),
      getRecentChanges(id),
      getProjectSummary(id),
      getProjectReviews(id),
    ]);

  const checklist = [
    { label: "Project created", done: true, hint: null },
    {
      label: "Architecture state generated",
      done: architectureState !== null,
      hint: "saedra memory state update --ai",
    },
    {
      label: "First decision recorded",
      done: decisions.length > 0,
      hint: "saedra memory decision add",
    },
    {
      label: "First change logged",
      done: changes.length > 0,
      hint: "saedra memory change log --from-git",
    },
  ];

  const setupComplete = checklist.every((item) => {
    return item.done;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <OverviewHeader summary={summary} />

      {!setupComplete && (
        <ProjectSetupBanner projectId={id} checklist={checklist} />
      )}

      <KpiStrip
        summary={summary}
        decisions={decisions}
        reviews={reviews}
        rules={rules}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5 items-start">
        <ArchitectureStateCard projectId={id} state={architectureState} />
        <div className="flex flex-col gap-5">
          <DecisionsPreview projectId={id} decisions={decisions.slice(0, 3)} />
          <ChangesPreview projectId={id} changes={changes.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}
