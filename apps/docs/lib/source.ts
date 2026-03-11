import type { StructuredData } from "fumadocs-core/mdx-plugins";
import type { TOCItemType } from "fumadocs-core/server";
import {
  type InferMetaType,
  type InferPageType,
  loader,
} from "fumadocs-core/source";
import { resolveFiles } from "fumadocs-mdx";

import { docs } from "@/.source";

export interface MdxPageData {
  title: string;
  description?: string;
  icon?: string;
  full?: boolean;
  body: (props: { components?: Record<string, unknown> }) => React.ReactElement;
  toc: TOCItemType[];
  structuredData: StructuredData;
}

export const source = loader({
  baseUrl: "/docs",
  source: {
    files: resolveFiles({ docs: docs.docs, meta: docs.meta }),
  },
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
