"use client";

import { BreadcrumbProvider } from "../../contexts/BreadcrumbContext";
import { ProjectsProvider } from "../../contexts/ProjectsContext";
import { UserProvider } from "../../contexts/UserContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ProjectsProvider>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </ProjectsProvider>
    </UserProvider>
  );
}
