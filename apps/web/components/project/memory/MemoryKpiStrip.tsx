import * as React from "react";

import type { ArchitectureState } from "../../../auth/documents";

interface TileProps {
  label: string;
  value: React.ReactNode;
  sub: string;
  accent?: boolean;
}

const Tile = ({ label, value, sub, accent }: TileProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`text-3xl font-mono font-semibold ${accent ? "text-brand" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="text-[11px] font-mono text-muted-foreground">{sub}</p>
    </div>
  );
};

export const MemoryKpiStrip = ({ state }: { state: ArchitectureState }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Tile
        label="State version"
        value={`v${state.version}`}
        sub="current snapshot"
        accent
      />
      <Tile
        label="Core principles"
        value={state.core_principles.length}
        sub="guiding rules"
      />
      <Tile
        label="Critical paths"
        value={state.critical_paths.length}
        sub="traced flows"
      />
      <Tile
        label="Constraints"
        value={state.constraints.length}
        sub="guardrails"
      />
    </div>
  );
};
