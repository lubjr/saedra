import type { Decision } from "../../../auth/documents";

export const STATUS_CLASSES: Record<string, string> = {
  active: "bg-brand-fill text-brand border-brand-stroke",
  deprecated: "bg-muted/40 text-muted-foreground border-border/30",
  superseded:
    "bg-status-warning-fill text-status-warning border-status-warning-stroke",
};

export const RISK_CLASSES: Record<string, string> = {
  low: "bg-brand-fill text-brand border-brand-stroke",
  medium:
    "bg-status-warning-fill text-status-warning border-status-warning-stroke",
  high: "bg-status-error-fill text-status-error border-status-error-stroke",
};

export const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

export const formatFullDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const buildSupersededBy = (
  decisions: Decision[],
): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const d of decisions) {
    if (d.supersedes) {
      map[d.supersedes] = d.id;
    }
  }
  return map;
};
