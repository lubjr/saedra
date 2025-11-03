"use client";

import * as React from "react";

import { getProjects } from "../../auth/projects";

type ProjectsContextType = {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
} | null;

const ProjectsContext = React.createContext<ProjectsContextType>(null);

export const ProjectsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projects, setProjects] = React.useState<ProjectsContextType>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await getProjects();
      setProjects(userData?.projects || null);
    };

    fetchUser();
  }, []);

  return (
    <ProjectsContext.Provider value={projects}>
      {children}
    </ProjectsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => {
  return React.useContext(ProjectsContext);
};
