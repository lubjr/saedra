"use client";

import * as React from "react";
import { toast } from "sonner";

import { EmptyProjects } from "../../../components/EmptyProjects";
import { useProjects } from "../../contexts/ProjectsContext";

export default function Page() {
  React.useEffect(() => {
    toast.dismiss("login");
  }, []);

  const { projects } = useProjects();

  const projectsList = Array.isArray(projects)
    ? projects
    : projects
      ? [projects]
      : [];

  return (
    <>
      {projectsList.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div>You have {projectsList.length} projects.</div>
      )}
    </>
  );
}
