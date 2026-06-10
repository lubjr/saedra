"use client";

import { Button } from "@repo/ui/button";
import { AlertIcon, TrashIcon } from "@repo/ui/lucide";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { deleteProject } from "../../../auth/projects";
import { SettingsCard } from "./SettingsCard";

interface Props {
  projectId: string;
  projectName: string;
}

export const DangerCard = ({ projectId, projectName }: Props) => {
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteProject({ projectId });
    setIsDeleting(false);

    if (result?.sucess) {
      toast.success("Project deleted.");
      router.push("/dashboard");
    } else {
      toast.error("Failed to delete project.");
    }
  };

  return (
    <SettingsCard
      danger
      icon={<AlertIcon className="size-4" />}
      title="Danger zone"
      desc="Irreversible actions. Proceed with care."
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm font-semibold text-zinc-100">
            Delete this project
          </div>
          <p className="text-sm text-zinc-400 mt-1 max-w-md leading-relaxed">
            Permanently removes the project, its decisions, reviews and memory.
            Your repository is not touched.
          </p>
        </div>
        {!confirming && (
          <Button
            variant="destructive"
            size="sm"
            className="shrink-0"
            onClick={() => {
              setConfirming(true);
            }}
          >
            <TrashIcon className="size-[13px]" /> Delete project
          </Button>
        )}
      </div>

      {confirming && (
        <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/[0.04] p-4 space-y-3">
          <p className="text-sm text-zinc-300">
            Type{" "}
            <code className="font-mono text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
              {projectName}
            </code>{" "}
            to confirm.
          </p>
          <div className="flex items-center gap-2 max-w-md">
            <input
              className="font-mono text-sm flex h-9 w-full rounded-md border border-red-500/30 bg-zinc-800/30 px-3 py-1 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-red-500/50 focus:ring-[3px] focus:ring-red-500/20 transition"
              placeholder={projectName}
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0"
              onClick={handleDelete}
              disabled={typed !== projectName || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete forever"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setConfirming(false);
                setTyped("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </SettingsCard>
  );
};
