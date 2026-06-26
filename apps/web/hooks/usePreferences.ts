"use client";
import * as React from "react";

export type Preferences = {
  theme: "system" | "dark" | "light";
  density: "comfortable" | "compact";
  reduceMotion: boolean;
  language: "en" | "pt-BR" | "es";
  timezone: string;
  timestamps: "relative" | "exact";
  startPage: "home" | "last";
  projectSort: "recent" | "name" | "health";
};

const DEFAULTS: Preferences = {
  theme: "dark",
  density: "comfortable",
  reduceMotion: false,
  language: "en",
  timezone: "America/Sao_Paulo",
  timestamps: "relative",
  startPage: "home",
  projectSort: "recent",
};

const KEY = "saedra:preferences";

export const usePreferences = () => {
  const [prefs, setPrefs] = React.useState<Preferences>(DEFAULTS);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      // storage unavailable
    }
  }, []);

  const save = (next: Partial<Preferences>) => {
    setPrefs((p) => {
      const merged = { ...p, ...next };
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        // storage unavailable
      }
      return merged;
    });
  };

  return { prefs, save };
};
