"use client";

type Filter = "all" | "active" | "setup" | "archived";

interface Props {
  active: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
}

const chips: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Setup", value: "setup" },
  { label: "Archived", value: "archived" },
];

export const FilterChips = ({ active, onChange, counts }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        return (
          <button
            key={chip.value}
            onClick={() => {
              return onChange(chip.value);
            }}
            className={`border rounded-full px-2.5 py-1 font-mono text-xs transition-colors cursor-pointer ${
              active === chip.value
                ? "bg-zinc-900 border-zinc-700 text-foreground"
                : "border-zinc-800 text-muted-foreground hover:border-zinc-700 hover:text-foreground"
            }`}
          >
            {chip.label} · {counts[chip.value]}
          </button>
        );
      })}
    </div>
  );
};
