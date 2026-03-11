import { createSearchAPI } from "fumadocs-core/search/server";

import { type MdxPageData, source } from "@/lib/source";

export const { GET } = createSearchAPI("advanced", {
  indexes: source.getPages().map((page) => {
    const data = page.data as unknown as MdxPageData;
    return {
      title: data.title,
      description: data.description ?? "",
      url: page.url,
      id: page.url,
      structuredData: data.structuredData,
    };
  }),
});
