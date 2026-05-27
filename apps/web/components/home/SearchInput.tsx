"use client";

import { SearchIcon } from "@repo/ui/lucide";
import * as React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      return window.removeEventListener("keydown", handler);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onChange("");
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex-1 max-w-md">
      <div
        className={`flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 min-w-[320px] transition-all ${value ? "ring-1 ring-teal-500/30" : "focus-within:ring-1 focus-within:ring-teal-500/30"}`}
      >
        <SearchIcon className="size-3.5 text-zinc-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            return onChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search projects..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-zinc-500 outline-none"
        />
      </div>
    </div>
  );
};
