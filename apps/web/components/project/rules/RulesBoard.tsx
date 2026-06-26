"use client";

import * as React from "react";

import type { ViolationRule } from "../../../auth/documents";
import { sortBySeverity } from "./helpers";
import { RuleCard } from "./RuleCard";

type Filter = "all" | ViolationRule["severity"];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

interface Props {
  rules: ViolationRule[];
}

export const RulesBoard = ({ rules }: Props) => {
  const [filter, setFilter] = React.useState<Filter>("all");

  const counts: Record<Filter, number> = {
    all: rules.length,
    high: rules.filter((r) => {
      return r.severity === "high";
    }).length,
    medium: rules.filter((r) => {
      return r.severity === "medium";
    }).length,
    low: rules.filter((r) => {
      return r.severity === "low";
    }).length,
  };

  const visible = sortBySeverity(
    filter === "all"
      ? rules
      : rules.filter((r) => {
          return r.severity === filter;
        }),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(({ key, label }) => {
          const on = key === filter;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                on
                  ? "bg-brand-fill border-brand-stroke text-brand"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-border-emphasis"
              }`}
            >
              {label}
              <span
                className={`font-mono ${on ? "text-brand/70" : "text-muted-foreground"}`}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.map((rule) => {
          return <RuleCard key={rule.id} rule={rule} />;
        })}
      </div>
    </div>
  );
};
