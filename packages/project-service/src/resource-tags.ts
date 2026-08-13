export const resourceTags = {
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
  projectSettings: (projectId: string) => {
    return `project:${projectId}:settings`;
  },
  user: () => {
    return "user";
  },
};

export const documentResourceTag = (
  projectId: string,
  type: string,
): string | null => {
  switch (type) {
    case "architecture":
      return resourceTags.projectArchitecture(projectId);
    case "decision":
      return resourceTags.projectDecisions(projectId);
    case "change":
      return resourceTags.projectChanges(projectId);
    case "rule":
      return resourceTags.projectRules(projectId);
    default:
      return null;
  }
};
