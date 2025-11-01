"use client";

import * as React from "react";
import { toast } from "sonner";

import { EmptyProjects } from "../../../components/EmptyProjects";

export default function Page() {
  React.useEffect(() => {
    toast.dismiss("login");
  }, []);

  const projects: any[] = [];

  return (
    <>
      {projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div>Your Projects Here</div>
      )}
    </>
  );
}
