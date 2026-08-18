"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import type { SortOption } from "./decisions/helpers";

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
  tierLabel: string;
}

export const SortControl = ({ value, onChange, tierLabel }: Props) => {
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        onChange(v as SortOption);
      }}
    >
      <SelectTrigger className="w-[150px] shrink-0 font-mono text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-muted">
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="oldest">Oldest first</SelectItem>
        <SelectItem value="tier">{tierLabel}</SelectItem>
      </SelectContent>
    </Select>
  );
};
