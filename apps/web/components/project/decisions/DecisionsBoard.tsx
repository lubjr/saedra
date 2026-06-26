"use client";

import { SearchIcon } from "@repo/ui/lucide";
import * as React from "react";

import type { Decision } from "../../../auth/documents";
import { DecisionDetail } from "./DecisionDetail";
import { formatRelativeDate, RISK_CLASSES, STATUS_CLASSES } from "./helpers";

const STATUS_DOT: Record<string, string> = {
  active: "bg-brand",
  deprecated: "bg-muted-foreground",
  superseded: "bg-status-warning",
};

interface Props {
  decisions: Decision[];
  supersededBy: Record<string, string>;
}

export const DecisionsBoard = ({ decisions, supersededBy }: Props) => {
  const [selected, setSelected] = React.useState<string | null>(
    decisions[0]?.id ?? null,
  );
  const [query, setQuery] = React.useState("");

  const filtered = decisions.filter((d) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
  });

  const effectiveSelected = filtered.find((d) => {
    return d.id === selected;
  })
    ? selected
    : (filtered[0]?.id ?? null);

  const selectedDecision =
    filtered.find((d) => {
      return d.id === effectiveSelected;
    }) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] rounded-xl border border-border overflow-hidden">
      <div className="flex flex-col border-b border-border lg:border-b-0 lg:border-r lg:border-border">
        <div className="flex items-center gap-2.5 border-b border-border bg-card px-4 py-3">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search decisions..."
            value={query}
            onChange={(e) => {
              return setQuery(e.target.value);
            }}
            className="w-full bg-transparent font-mono text-xs text-foreground/80 placeholder:text-muted-foreground/50 outline-none"
          />
        </div>
        <div className="overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              No decisions match
            </p>
          ) : (
            <ul>
              {filtered.map((d) => {
                const isSelected = d.id === effectiveSelected;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => {
                        return setSelected(d.id);
                      }}
                      className={`w-full text-left px-4 py-3.5 border-l-2 transition-colors ${isSelected ? "border-brand bg-brand-fill/50" : "border-transparent hover:bg-muted/50"}`}
                    >
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`size-1.5 rounded-full shrink-0 mt-1.5 ${STATUS_DOT[d.status] ?? "bg-muted-foreground"}`}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground leading-snug truncate">
                              {d.title}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                              {d.id} · {formatRelativeDate(d.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${STATUS_CLASSES[d.status] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {d.status}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${RISK_CLASSES[d.risk_level] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {d.risk_level}
                          </span>
                        </div>
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
        {selectedDecision ? (
          <DecisionDetail
            decision={selectedDecision}
            supersededBy={supersededBy}
          />
        ) : (
          <p className="p-6 text-sm text-muted-foreground">
            No decision selected.
          </p>
        )}
      </div>
    </div>
  );
};
