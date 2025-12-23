"use client";

import * as React from "react";

import { createProject, deleteProject, getProjects } from "../../auth/projects";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProjectsContextType = any[] | null;

const ProjectsContext = React.createContext<{
  projects: ProjectsContextType;
  isLoading: boolean;
  create: typeof createProject;
  delete: typeof deleteProject;
  refresh: () => Promise<void>;
}>({
  projects: null,
  isLoading: true,
  create: () => {
    return Promise.reject("not ready");
  },
  delete: () => {
    return Promise.reject("not ready");
  },
  refresh: () => {
    return Promise.resolve();
  },
});

export const ProjectsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projects, setProjects] = React.useState<ProjectsContextType>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    const data = await getProjects();
    setProjects(data?.projects ?? null);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteProj = React.useCallback(
    async (...args: Parameters<typeof deleteProject>) => {
      const resolve = await deleteProject(...args);
      await refresh();
      return resolve;
    },
    [refresh],
  );

  const create = React.useCallback(
    async (...args: Parameters<typeof createProject>) => {
      const resolve = await createProject(...args);
      await refresh();
      return resolve;
    },
    [refresh],
  );

  return (
    <ProjectsContext.Provider
      value={{ projects, isLoading, create, delete: deleteProj, refresh }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => {
  const context = React.useContext(ProjectsContext);
  if (!context) {
    throw new Error("use projects must be used within projects provider");
  }
  return context;
};
