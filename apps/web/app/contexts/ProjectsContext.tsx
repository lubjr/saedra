"use client";

import * as React from "react";
import useSWR from "swr";

import { cacheTags } from "../../auth/cache-tags";
import { createProject, deleteProject, getProjects } from "../../auth/projects";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProjectsContextType = any[] | null;

const PROJECTS_KEY = cacheTags.projects();

const fetchProjects = async (): Promise<ProjectsContextType> => {
  const data = await getProjects();
  return data?.projects ?? null;
};

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
  const {
    data: projects,
    isLoading,
    mutate,
  } = useSWR(PROJECTS_KEY, fetchProjects, {
    fallbackData: null,
    revalidateOnFocus: true,
    refreshInterval: 60_000,
  });

  const refresh = React.useCallback(async () => {
    await mutate();
  }, [mutate]);

  const deleteProj = React.useCallback(
    async (...args: Parameters<typeof deleteProject>) => {
      const resolve = await deleteProject(...args);
      await mutate();
      return resolve;
    },
    [mutate],
  );

  const create = React.useCallback(
    async (...args: Parameters<typeof createProject>) => {
      const resolve = await createProject(...args);
      await mutate();
      return resolve;
    },
    [mutate],
  );

  return (
    <ProjectsContext.Provider
      value={{
        projects: projects ?? null,
        isLoading,
        create,
        delete: deleteProj,
        refresh,
      }}
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
