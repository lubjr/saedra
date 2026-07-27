import {
  getArchitectureState,
  getDecisions,
  getRecentChanges,
  getViolationRules,
} from "../../../../../../auth/documents";
import { getProjectSummary } from "../../../../../../auth/projects";
import { ChangesBoard } from "../../../../../../components/project/changes/ChangesBoard";
import { DecisionsBoard } from "../../../../../../components/project/decisions/DecisionsBoard";
import { buildSupersededBy } from "../../../../../../components/project/decisions/helpers";
import { ActiveDecisionsCard } from "../../../../../../components/project/memory/ActiveDecisionsCard";
import { ConstraintsCard } from "../../../../../../components/project/memory/ConstraintsCard";
import { CriticalPathsCard } from "../../../../../../components/project/memory/CriticalPathsCard";
import type { FolderKey } from "../../../../../../components/project/memory/FolderPills";
import { MemoryEmpty } from "../../../../../../components/project/memory/MemoryEmpty";
import { MemoryHeader } from "../../../../../../components/project/memory/MemoryHeader";
import { MemoryShell } from "../../../../../../components/project/memory/MemoryShell";
import { PrinciplesCard } from "../../../../../../components/project/memory/PrinciplesCard";
import { SummaryCard } from "../../../../../../components/project/memory/SummaryCard";
import { RulesBoard } from "../../../../../../components/project/rules/RulesBoard";

const FOLDER_KEYS: FolderKey[] = ["decisions", "changes", "rules"];

const isFolderKey = (value: string | undefined): value is FolderKey => {
  return value !== undefined && (FOLDER_KEYS as string[]).includes(value);
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folder?: string; itemId?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { folder, itemId } = await searchParams;

  const [state, decisions, changes, rules, summary] = await Promise.all([
    getArchitectureState(id),
    getDecisions(id),
    getRecentChanges(id, 50),
    getViolationRules(id),
    getProjectSummary(id),
  ]);

  const hasState = !!state;
  const activeFolder: FolderKey | null =
    hasState && isFolderKey(folder) ? folder : null;

  let content: React.ReactNode;

  if (activeFolder === "decisions") {
    content = (
      <DecisionsBoard
        decisions={decisions}
        supersededBy={buildSupersededBy(decisions)}
        initialSelectedId={itemId ?? null}
      />
    );
  } else if (activeFolder === "changes") {
    content = (
      <ChangesBoard changes={changes} initialSelectedId={itemId ?? null} />
    );
  } else if (activeFolder === "rules") {
    content = <RulesBoard rules={rules} initialSelectedId={itemId ?? null} />;
  } else if (!state) {
    content = <MemoryEmpty />;
  } else {
    const decisionById = new Map(
      decisions.map((d) => {
        return [d.id, d];
      }),
    );
    const activeDecisions = state.active_decisions.map((ref) => {
      const match = decisionById.get(ref);
      return { id: ref, title: match?.title ?? ref };
    });

    content = (
      <>
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
      </>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <MemoryHeader summary={summary} hasState={hasState} />
      <MemoryShell
        projectId={id}
        activeFolder={activeFolder}
        hasState={hasState}
        summary={summary}
        decisions={decisions}
        changes={changes}
        rules={rules}
      >
        {content}
      </MemoryShell>
    </div>
  );
}
