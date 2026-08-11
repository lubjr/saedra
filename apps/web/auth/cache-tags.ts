/**
 * Single source of truth for Next.js Data Cache tags used across `apps/web/auth/*`.
 * Reused as SWR keys (client cache, Phase 2) and, in the future, as the lookup for
 * which resource a NATS invalidation event maps to (Phase 6) — keep these stable.
 */
export const cacheTags = {
  projects: () => {
    return "projects";
  },
  projectArchitecture: (projectId: string) => {
    return `project:${projectId}:architecture`;
  },
  projectDecisions: (projectId: string) => {
    return `project:${projectId}:decisions`;
  },
  projectRules: (projectId: string) => {
    return `project:${projectId}:rules`;
  },
  projectChanges: (projectId: string) => {
    return `project:${projectId}:changes`;
  },
  projectReviews: (projectId: string) => {
    return `project:${projectId}:reviews`;
  },
  projectReview: (projectId: string, reviewId: string) => {
    return `project:${projectId}:review:${reviewId}`;
  },
  projectSettings: (projectId: string) => {
    return `project:${projectId}:settings`;
  },
  user: () => {
    return "user";
  },
};
