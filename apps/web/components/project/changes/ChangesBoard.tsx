"use client";

import { SearchIcon } from "@repo/ui/lucide";
import * as React from "react";

import type { ChangeEvent } from "../../../auth/documents";
import { formatRelativeDate } from "../decisions/helpers";
import { ChangeDetail } from "./ChangeDetail";
import { inferRisk, RISK_CLASSES, RISK_DOT } from "./helpers";

interface Props {
  changes: ChangeEvent[];
}

export const ChangesBoard = ({ changes }: Props) => {
  const [selected, setSelected] = React.useState<string | null>(
    changes[0]?.id ?? null,
  );
  const [query, setQuery] = React.useState("");

  const filtered = changes.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.summary.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.files_changed.some((f) => {
        return f.toLowerCase().includes(q);
      })
    );
  });

  const effectiveSelected = filtered.find((c) => {
    return c.id === selected;
  })
    ? selected
    : (filtered[0]?.id ?? null);

  const selectedChange =
    filtered.find((c) => {
      return c.id === effectiveSelected;
    }) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex flex-col border-b border-zinc-800 lg:border-b-0 lg:border-r lg:border-zinc-800">
        <div className="flex items-center gap-2.5 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
          <SearchIcon className="size-4 shrink-0 text-zinc-500" />
          <input
            type="text"
            placeholder="Search changes..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="w-full bg-transparent font-mono text-xs text-zinc-300 placeholder:text-zinc-600 outline-none"
          />
        </div>
        <div className="overflow-y-auto lg:max-h-[560px]">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-xs text-zinc-600">
              No changes match
            </p>
          ) : (
            <ul>
              {filtered.map((c) => {
                const isSelected = c.id === effectiveSelected;
                const risk = inferRisk(c.risk_assessment);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(c.id);
                      }}
                      className={`w-full text-left px-4 py-3.5 border-l-2 transition-colors ${isSelected ? "border-teal-400 bg-teal-500/5" : "border-transparent hover:bg-zinc-800/50"}`}
                    >
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`size-1.5 rounded-full shrink-0 mt-1.5 ${RISK_DOT[risk]}`}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-zinc-200 leading-snug line-clamp-2">
                              {c.summary}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-zinc-600">
                              {c.id} · {formatRelativeDate(c.created_at)} ·{" "}
                              {c.files_changed.length} file
                              {c.files_changed.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium ${RISK_CLASSES[risk]}`}
                        >
                          {risk}
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

      <div className="bg-zinc-900 overflow-y-auto lg:max-h-[600px]">
        {selectedChange ? (
          <ChangeDetail change={selectedChange} />
        ) : (
          <p className="p-6 text-sm text-zinc-600">No change selected.</p>
        )}
      </div>
    </div>
  );
};
