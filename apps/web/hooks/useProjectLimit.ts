"use client";

import { useProjects } from "../app/contexts/ProjectsContext";
import { useUser } from "../app/contexts/UserContext";

export const useProjectLimit = () => {
  const { user } = useUser();
  const { projects } = useProjects();

  const projectCount = Array.isArray(projects) ? projects.length : 0;
  const isAtLimit = user?.plan === "standard" && projectCount >= 1;

  return { isAtLimit };
};
