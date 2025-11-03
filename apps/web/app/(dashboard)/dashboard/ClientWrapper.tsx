"use client";

import { ProjectsProvider } from "../../contexts/ProjectsContext";
import { UserProvider } from "../../contexts/UserContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ProjectsProvider>{children}</ProjectsProvider>
    </UserProvider>
  );
}
