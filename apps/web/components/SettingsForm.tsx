"use client";

import { Button } from "@repo/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import * as React from "react";
import { toast } from "sonner";

import type { ProjectSettingsResponse } from "../auth/settings";
import { deleteProjectSettings, updateProjectSettings } from "../auth/settings";

const PROVIDERS = [
  { value: "claude", label: "Claude (Anthropic)" },
  { value: "openai", label: "OpenAI" },
];

const MODELS: Record<string, Array<{ value: string; label: string }>> = {
  claude: [
    { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
    { value: "claude-opus-4-6", label: "Claude Opus 4.6" },
    { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  ],
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  ],
};

const getModelLabel = (provider: string, model: string) => {
  return (
    MODELS[provider]?.find((m) => {
      return m.value === model;
    })?.label ?? model
  );
};

const getProviderLabel = (provider: string) => {
  return (
    PROVIDERS.find((p) => {
      return p.value === provider;
    })?.label ?? provider
  );
};

export const SettingsForm = ({
  projectId,
  settings,
}: {
  projectId: string;
  settings: ProjectSettingsResponse;
}) => {
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

  if (isConfigured && !isEditing) {
    return (
      <div className="space-y-4 max-w-md">
        <div className="rounded-md bg-teal-500/10 border border-teal-500/20 px-4 py-3 space-y-0.5">
          <p className="text-xs text-teal-400 font-medium uppercase tracking-wider">
            Active configuration
          </p>
          <p className="text-sm text-zinc-200">
            {getProviderLabel(savedProvider)} —{" "}
            {getModelLabel(savedProvider, savedModel)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleEdit} disabled={isRemoving}>
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
          >
            {isRemoving ? "Removing..." : "Remove configuration"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md">
      {!isConfigured && (
        <div className="rounded-md bg-zinc-800 border border-zinc-700 px-4 py-3">
          <p className="text-sm text-zinc-400">
            No configuration set. Choose a provider and model to get started.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="provider" className="text-sm font-medium">
          AI Provider
        </label>
        <Select value={provider} onValueChange={handleProviderChange}>
          <SelectTrigger id="provider">
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
        <label htmlFor="model" className="text-sm font-medium">
          Model
        </label>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger id="model">
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
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
        {isConfigured && (
          <Button variant="ghost" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
