"use client";

import { SearchIcon } from "@repo/ui/lucide";
import * as React from "react";

import type { ViolationRule } from "../../../auth/documents";
import {
  formatRelativeDate,
  sortByOption,
  type SortOption,
} from "../decisions/helpers";
import { SortControl } from "../SortControl";
import { SEVERITY_CLASSES, SEVERITY_DOT } from "./helpers";
import { RuleDetail } from "./RuleDetail";

interface Props {
  rules: ViolationRule[];
  initialSelectedId?: string | null;
}

export const RulesBoard = ({ rules, initialSelectedId }: Props) => {
  const [sort, setSort] = React.useState<SortOption>("newest");
  const sorted = sortByOption(rules, sort, (r) => {
    return r.severity;
  });
  const [selected, setSelected] = React.useState<string | null>(
    initialSelectedId ?? sorted[0]?.id ?? null,
  );
  const [query, setQuery] = React.useState("");

  const filtered = sorted.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      r.description.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
    );
  });

  const effectiveSelected = filtered.find((r) => {
    return r.id === selected;
  })
    ? selected
    : (filtered[0]?.id ?? null);

  const selectedRule =
    filtered.find((r) => {
      return r.id === effectiveSelected;
    }) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] rounded-xl border border-border overflow-hidden">
      <div className="flex flex-col border-b border-border lg:border-b-0 lg:border-r lg:border-border">
        <div className="flex items-center gap-2.5 border-b border-border bg-card px-4 py-3">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rules..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="w-full bg-transparent font-mono text-xs text-foreground/80 placeholder:text-muted-foreground/50 outline-none"
          />
          <SortControl value={sort} onChange={setSort} tierLabel="Severity" />
        </div>
        <div className="overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              No rules match
            </p>
          ) : (
            <ul>
              {filtered.map((r) => {
                const isSelected = r.id === effectiveSelected;
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(r.id);
                      }}
                      className={`w-full cursor-pointer text-left px-4 py-3.5 border-l-2 transition-colors ${isSelected ? "border-brand bg-brand-fill/50" : "border-transparent hover:bg-muted/50"}`}
                    >
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`size-1.5 rounded-full shrink-0 mt-1.5 ${SEVERITY_DOT[r.severity]}`}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">
                              {r.description}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                              {r.id} · {formatRelativeDate(r.created_at)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium ${SEVERITY_CLASSES[r.severity]}`}
                        >
                          {r.severity}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-card overflow-y-auto">
        {selectedRule ? (
          <RuleDetail rule={selectedRule} />
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No rule selected.</p>
        )}
      </div>
    </div>
  );
};
