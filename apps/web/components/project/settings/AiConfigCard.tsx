"use client";

import { Button } from "@repo/ui/button";
import {
  PencilIcon,
  SparklesIcon,
  TerminalIcon,
  TrashIcon,
} from "@repo/ui/lucide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import * as React from "react";
import { toast } from "sonner";

import type { ProjectSettingsResponse } from "../../../auth/settings";
import {
  deleteProjectSettings,
  updateProjectSettings,
} from "../../../auth/settings";
import { SettingsCard } from "./SettingsCard";

const PROVIDERS = [
  { value: "claude", label: "Claude (Anthropic)" },
  { value: "openai", label: "OpenAI" },
];

const MODELS: Record<
  string,
  Array<{ value: string; label: string; note: string }>
> = {
  claude: [
    {
      value: "claude-sonnet-4-6",
      label: "Claude Sonnet 4.6",
      note: "Best balance for reviews",
    },
    {
      value: "claude-opus-4-6",
      label: "Claude Opus 4.6",
      note: "Deepest reasoning, slower",
    },
    {
      value: "claude-haiku-4-5-20251001",
      label: "Claude Haiku 4.5",
      note: "Fastest, lighter checks",
    },
  ],
  openai: [
    { value: "gpt-4o", label: "GPT-4o", note: "General purpose" },
    {
      value: "gpt-4o-mini",
      label: "GPT-4o Mini",
      note: "Fastest, lighter checks",
    },
  ],
};

const getProviderLabel = (provider: string) => {
  return (
    PROVIDERS.find((p) => {
      return p.value === provider;
    })?.label ?? provider
  );
};

const getModelNote = (provider: string, model: string) => {
  return (
    MODELS[provider]?.find((m) => {
      return m.value === model;
    })?.note ?? ""
  );
};

interface Props {
  projectId: string;
  settings: ProjectSettingsResponse;
}

export const AiConfigCard = ({ projectId, settings }: Props) => {
  const [isConfigured, setIsConfigured] = React.useState(
    settings.is_configured,
  );
  const [isEditing, setIsEditing] = React.useState(!settings.is_configured);
  const [provider, setProvider] = React.useState(settings.ai_provider);
  const [model, setModel] = React.useState(settings.model);
  const [savedProvider, setSavedProvider] = React.useState(
    settings.ai_provider,
  );
  const [savedModel, setSavedModel] = React.useState(settings.model);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);

  const showForm = isEditing || !isConfigured;
  const availableModels = MODELS[provider] ?? [];

  const handleProviderChange = (value: string) => {
    setProvider(value);
    setModel(MODELS[value]?.[0]?.value ?? "");
  };

  const handleEdit = () => {
    setProvider(savedProvider);
    setModel(savedModel);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProvider(savedProvider);
    setModel(savedModel);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const ok = await updateProjectSettings(projectId, {
      ai_provider: provider,
      model,
    });
    setIsLoading(false);

    if (ok) {
      setSavedProvider(provider);
      setSavedModel(model);
      setIsConfigured(true);
      setIsEditing(false);
      toast.success("Settings saved.");
    } else {
      toast.error("Failed to save settings.");
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    const ok = await deleteProjectSettings(projectId);
    setIsRemoving(false);

    if (ok) {
      setIsConfigured(false);
      setIsEditing(true);
      toast.success("Configuration removed.");
    } else {
      toast.error("Failed to remove configuration.");
    }
  };

  return (
    <SettingsCard
      icon={<SparklesIcon className="size-4" />}
      title="AI Configuration"
      desc={
        <>
          Provider and model used by all team members when running{" "}
          <code className="font-mono text-xs bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded">
            saedra review
          </code>
          . The API key stays local — configure it via{" "}
          <code className="font-mono text-xs bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded">
            saedra ai setup
          </code>
          .
        </>
      }
      footer={
        showForm ? (
          <>
            <span className="text-xs text-zinc-500">
              Applies to every member of this project.
            </span>
            <div className="flex items-center gap-2">
              {isConfigured && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="brand"
                size="sm"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save configuration"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="text-xs text-zinc-500">
              Saved by <span className="font-mono text-zinc-400">you</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <TrashIcon className="size-[13px]" />
              {isRemoving ? "Removing..." : "Remove configuration"}
            </Button>
          </>
        )
      }
    >
      {showForm ? (
        <div className="space-y-5">
          {!isConfigured && (
            <div className="flex items-center gap-3 rounded-md border border-zinc-700 bg-zinc-800/40 px-4 py-3">
              <span className="size-1.5 rounded-full bg-yellow-400 shrink-0" />
              <p className="text-sm text-zinc-400">
                No configuration set. Choose a provider and model to get
                started.
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                <SparklesIcon className="size-[14px]" /> AI Provider
              </label>
              <Select value={provider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800">
                  {PROVIDERS.map((p) => {
                    return (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                <TerminalIcon className="size-[14px]" /> Model
              </label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800">
                  {availableModels.map((m) => {
                    return (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500">
                {getModelNote(provider, model)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-teal-500/20 bg-teal-500/[0.06] px-4 py-3.5">
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="size-9 rounded-lg bg-teal-500/10 text-teal-400 grid place-items-center shrink-0">
              <SparklesIcon className="size-[17px]" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-100">
                  {getProviderLabel(savedProvider)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-500/20 bg-teal-500/10 text-teal-400 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  <span className="size-1 rounded-full bg-teal-400" /> Active
                </span>
              </div>
              <div className="font-mono text-xs text-zinc-400 mt-1 truncate">
                {savedModel}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <PencilIcon className="size-[13px]" /> Edit
          </Button>
        </div>
      )}
    </SettingsCard>
  );
};
