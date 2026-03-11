import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { type MdxPageData, source } from "@/lib/source";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const data = page.data as unknown as MdxPageData;
  const MDX = data.body;

  return (
    <DocsPage toc={data.toc} full={data.full}>
      <DocsTitle>{data.title}</DocsTitle>
      <DocsDescription>{data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export const generateStaticParams = async () => {
  return source.generateParams();
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const data = page.data as unknown as MdxPageData;

  return {
    title: data.title,
    description: data.description,
  };
};
