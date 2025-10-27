"use client";

import { UserProvider } from "../../contexts/UserContext";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
