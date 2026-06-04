import {
  getArchitectureState,
  getDecisions,
} from "../../../../../../auth/documents";
import { getProjectSummary } from "../../../../../../auth/projects";
import { ActiveDecisionsCard } from "../../../../../../components/project/memory/ActiveDecisionsCard";
import { ConstraintsCard } from "../../../../../../components/project/memory/ConstraintsCard";
import { CriticalPathsCard } from "../../../../../../components/project/memory/CriticalPathsCard";
import { MemoryEmpty } from "../../../../../../components/project/memory/MemoryEmpty";
import { MemoryHeader } from "../../../../../../components/project/memory/MemoryHeader";
import { MemoryKpiStrip } from "../../../../../../components/project/memory/MemoryKpiStrip";
import { PrinciplesCard } from "../../../../../../components/project/memory/PrinciplesCard";
import { SummaryCard } from "../../../../../../components/project/memory/SummaryCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [state, decisions, summary] = await Promise.all([
    getArchitectureState(id),
    getDecisions(id),
    getProjectSummary(id),
  ]);

  if (!state) {
    return (
      <div className="mx-auto max-w-6xl space-y-5">
        <MemoryHeader summary={summary} hasState={false} />
        <MemoryEmpty />
      </div>
    );
  }

  const decisionById = new Map(
    decisions.map((d) => {
      return [d.id, d];
    }),
  );
  const activeDecisions = state.active_decisions.map((ref) => {
    const match = decisionById.get(ref);
    return { id: ref, title: match?.title ?? ref };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <MemoryHeader summary={summary} hasState />
      <MemoryKpiStrip state={state} />
      <SummaryCard state={state} />

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <PrinciplesCard items={state.core_principles} />
          <CriticalPathsCard items={state.critical_paths} />
        </div>
        <div className="flex flex-col gap-5">
          <ConstraintsCard items={state.constraints} />
          <ActiveDecisionsCard projectId={id} decisions={activeDecisions} />
        </div>
      </div>
    </div>
  );
}
