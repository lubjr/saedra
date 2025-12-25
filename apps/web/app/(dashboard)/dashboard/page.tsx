"use client";

import * as React from "react";
import { toast } from "sonner";

import { EmptyProjects } from "../../../components/EmptyProjects";
import { useProjects } from "../../contexts/ProjectsContext";
import { Skeleton } from "@repo/ui/skeleton";

export default function Page() {
  React.useEffect(() => {
    toast.dismiss("login");
  }, []);

  const { projects, isLoading } = useProjects();

  const projectsList = Array.isArray(projects)
    ? projects
    : projects
      ? [projects]
      : [];

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="w-full max-w-2xl space-y-4 p-4">
          <Skeleton className="w-full" style={{ height: '128px' }} />
          <Skeleton className="w-full" style={{ height: '128px' }} />
          <Skeleton className="w-full" style={{ height: '128px' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      {projectsList.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <div>You have {projectsList.length} projects.</div>
        </div>
      )}
    </>
  );
}
