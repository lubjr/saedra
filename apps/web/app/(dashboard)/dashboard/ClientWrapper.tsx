"use client";

import { BreadcrumbProvider } from "../../contexts/BreadcrumbContext";
import { ProjectsProvider } from "../../contexts/ProjectsContext";
import { UserProvider } from "../../contexts/UserContext";
import { EventsProvider } from "../../providers/EventsProvider";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ProjectsProvider>
        <EventsProvider>
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </EventsProvider>
      </ProjectsProvider>
    </UserProvider>
  );
}
