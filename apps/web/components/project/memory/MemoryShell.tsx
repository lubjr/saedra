import * as React from "react";

import type {
  ChangeEvent,
  Decision,
  ViolationRule,
} from "../../../auth/documents";
import type { ProjectSummary } from "../../../auth/projects";
import { type FolderKey, FolderPills } from "./FolderPills";
import { MemoryKpiStrip } from "./MemoryKpiStrip";

interface Props {
  projectId: string;
  activeFolder: FolderKey | null;
  hasState: boolean;
  summary: ProjectSummary | null;
  decisions: Decision[];
  changes: ChangeEvent[];
  rules: ViolationRule[];
  children: React.ReactNode;
}

export const MemoryShell = ({
  projectId,
  activeFolder,
  hasState,
  summary,
  decisions,
  changes,
  rules,
  children,
}: Props) => {
  const counts: Record<FolderKey, number> = {
    decisions: decisions.length,
    changes: changes.length,
    rules: rules.length,
  };

  return (
    <div className="space-y-5">
      <MemoryKpiStrip
        summary={summary}
        decisions={decisions}
        changes={changes}
        rules={rules}
      />
      <FolderPills
        projectId={projectId}
        active={activeFolder}
        counts={counts}
        disabled={!hasState}
      />
      {children}
    </div>
  );
};
