"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import type {
  ChangeEvent,
  Decision,
  ViolationRule,
} from "../../../auth/documents";
import type { ProjectSummary } from "../../../auth/projects";
import { type FolderKey, FolderPills } from "./FolderPills";
import { MemoryKpiStrip } from "./MemoryKpiStrip";

const FOLDER_KEYS: FolderKey[] = ["decisions", "changes", "rules"];

const isFolderKey = (value: string | null): value is FolderKey => {
  return value !== null && (FOLDER_KEYS as string[]).includes(value);
};

interface Props {
  hasState: boolean;
  summary: ProjectSummary | null;
  decisions: Decision[];
  changes: ChangeEvent[];
  rules: ViolationRule[];
  root: (jumpToDecision: (id: string) => void) => React.ReactNode;
  decisionsContent: (itemId: string | null) => React.ReactNode;
  changesContent: (itemId: string | null) => React.ReactNode;
  rulesContent: (itemId: string | null) => React.ReactNode;
}

export const MemoryShell = ({
  hasState,
  summary,
  decisions,
  changes,
  rules,
  root,
  decisionsContent,
  changesContent,
  rulesContent,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const folderParam = searchParams.get("folder");
  const activeFolder: FolderKey | null = isFolderKey(folderParam)
    ? folderParam
    : null;
  const itemId = searchParams.get("itemId");

  const setFolder = (key: FolderKey | null, nextItemId?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key) {
      params.set("folder", key);
    } else {
      params.delete("folder");
    }
    if (nextItemId) {
      params.set("itemId", nextItemId);
    } else {
      params.delete("itemId");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleSelect = (key: FolderKey) => {
    setFolder(activeFolder === key ? null : key);
  };

  const jumpToDecision = (id: string) => {
    setFolder("decisions", id);
  };

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
        active={activeFolder}
        counts={counts}
        disabled={!hasState}
        onSelect={handleSelect}
      />
      {activeFolder === null && root(jumpToDecision)}
      {activeFolder === "decisions" && decisionsContent(itemId)}
      {activeFolder === "changes" && changesContent(itemId)}
      {activeFolder === "rules" && rulesContent(itemId)}
    </div>
  );
};
