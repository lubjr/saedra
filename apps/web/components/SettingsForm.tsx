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

import type { ProjectSettings } from "../auth/settings";
import { updateProjectSettings } from "../auth/settings";

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

export const SettingsForm = ({
  projectId,
  settings,
}: {
  projectId: string;
  settings: ProjectSettings;
}) => {
  const [provider, setProvider] = React.useState(settings.ai_provider);
  const [model, setModel] = React.useState(settings.model);
  const [isLoading, setIsLoading] = React.useState(false);

  const availableModels = MODELS[provider] ?? [];

  const handleProviderChange = (value: string) => {
    setProvider(value);
    const first = MODELS[value]?.[0]?.value ?? "";
    setModel(first);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const ok = await updateProjectSettings(projectId, {
      ai_provider: provider,
      model,
    });
    setIsLoading(false);

    if (ok) {
      toast.success("Settings saved.");
    } else {
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="space-y-6 max-w-md">
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

      <div className="pt-2">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};
