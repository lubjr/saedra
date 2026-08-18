import type { Decision } from "../../../auth/documents";

export const STATUS_CLASSES: Record<string, string> = {
  active: "bg-brand-fill text-brand border-brand-stroke",
  deprecated: "bg-muted/40 text-muted-foreground border-border/30",
  superseded:
    "bg-status-warning-fill text-status-warning border-status-warning-stroke",
};

// Shared low/medium/high tier classes — reused by decisions (risk),
// changes (risk) and rules (severity), which all use the same 3 tiers.
export type Tier = "low" | "medium" | "high";

export const TIER_CLASSES: Record<Tier, string> = {
  low: "bg-brand-fill text-brand border-brand-stroke",
  medium:
    "bg-status-warning-fill text-status-warning border-status-warning-stroke",
  high: "bg-status-error-fill text-status-error border-status-error-stroke",
};

export const TIER_DOT: Record<Tier, string> = {
  low: "bg-brand",
  medium: "bg-status-warning",
  high: "bg-status-error",
};

export const RISK_CLASSES = TIER_CLASSES;

export type SortOption = "newest" | "oldest" | "tier";

const TIER_RANK: Record<Tier, number> = { high: 0, medium: 1, low: 2 };

export const sortByOption = <T extends { created_at: string }>(
  items: T[],
  option: SortOption,
  getTier?: (item: T) => Tier,
): T[] => {
  const sorted = [...items];

  if (option === "tier" && getTier) {
    sorted.sort((a, b) => {
      const byTier = TIER_RANK[getTier(a)] - TIER_RANK[getTier(b)];
      if (byTier !== 0) return byTier;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    return sorted;
  }

  sorted.sort((a, b) => {
    const delta =
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return option === "oldest" ? -delta : delta;
  });
  return sorted;
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
