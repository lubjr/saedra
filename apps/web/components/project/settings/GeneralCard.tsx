"use client";

import { FileTextIcon, FolderIcon } from "@repo/ui/lucide";
import * as React from "react";

import { SettingsCard } from "./SettingsCard";

const inputCls =
  "font-mono text-sm flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-800/30 px-3 py-1 text-zinc-100 placeholder:text-zinc-500 outline-none read-only:opacity-50 read-only:cursor-not-allowed transition";

const textareaCls =
  "text-sm flex w-full rounded-md border border-zinc-700 bg-zinc-800/30 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 outline-none resize-none read-only:opacity-50 read-only:cursor-not-allowed transition";

interface Props {
  initialName: string;
}

export const GeneralCard = ({ initialName }: Props) => {
  const [name] = React.useState(initialName);

  return (
    <SettingsCard
      icon={<FolderIcon className="size-4" />}
      title="General"
      desc="Name and description shown across the dashboard and CLI."
      footer={
        <>
          <span className="text-xs text-zinc-500">Changes require CLI</span>
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-8 px-3 bg-teal-700 text-white opacity-50 cursor-not-allowed"
          >
            Save changes
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
            <FolderIcon className="size-[14px]" /> Project name
          </label>
          <input className={inputCls} value={name} readOnly />
          <p className="text-xs text-zinc-500">
            Used as the project identifier.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
            <FileTextIcon className="size-[14px]" /> Description
            <span className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-950 text-zinc-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
              Optional
            </span>
          </label>
          <textarea
            rows={2}
            className={textareaCls}
            placeholder="No description set"
            readOnly
          />
        </div>
      </div>
    </SettingsCard>
  );
};
