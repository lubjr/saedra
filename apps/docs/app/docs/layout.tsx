import { DocsLayout } from "fumadocs-ui/layouts/docs";
import * as React from "react";

import { source } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: "Saedra Docs",
      }}
    >
      {children}
    </DocsLayout>
  );
}
