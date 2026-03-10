#!/usr/bin/env tsx
/* eslint-disable no-console */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MONO_ROOT = path.resolve(__dirname, "../../../");
const DOCS_ROOT = path.resolve(MONO_ROOT, "docs");
const OUTPUT_ROOT = path.resolve(__dirname, "../content/docs");

interface OutputFile {
  outputPath: string;
  title: string;
  description: string;
  body: string;
}

interface SectionGroup {
  output: string;
  title: string;
  description: string;
  h2?: string[];
  h3Prefixes?: string[];
}

const CLI_GROUPS: SectionGroup[] = [
  {
    output: "cli/getting-started",
    title: "Getting Started",
    description: "Installation and configuration of the Saedra CLI",
    h2: ["Installation", "Configuration"],
  },
  {
    output: "cli/auth",
    title: "Authentication",
    description: "Login, logout, whoami, status and project initialization",
    h3Prefixes: [
      "`saedra login`",
      "`saedra whoami`",
      "`saedra status`",
      "`saedra logout`",
      "`saedra init`",
    ],
  },
  {
    output: "cli/projects",
    title: "Project Commands",
    description: "Create, list, and delete Saedra projects",
    h3Prefixes: ["`saedra project"],
  },
  {
    output: "cli/documents",
    title: "Document Commands",
    description: "Create, read, edit, push, and delete documents",
    h3Prefixes: ["`saedra doc"],
  },
  {
    output: "cli/memory",
    title: "Memory Commands",
    description: "Architecture state, decisions, and change events",
    h3Prefixes: ["`saedra memory"],
  },
  {
    output: "cli/ai",
    title: "AI Commands",
    description: "Configure and use AI-powered features",
    h3Prefixes: ["`saedra ai", "`saedra --version`", "`saedra --help`"],
  },
  {
    output: "cli/development",
    title: "Development",
    description: "Development workflow and file structure",
    h2: [
      "Development workflow",
      "File structure",
      "Where credentials are stored",
    ],
  },
];

const splitByH2 = (content: string): Map<string, string> => {
  const result = new Map<string, string>();
  const parts = content.split(/^## /m);
  for (const part of parts.slice(1)) {
    const newline = part.indexOf("\n");
    const heading = part.slice(0, newline).trim();
    const body = part.slice(newline + 1);
    result.set(heading, body);
  }
  return result;
};

const splitByH3 = (content: string): Map<string, string> => {
  const result = new Map<string, string>();
  const parts = content.split(/^### /m);
  for (const part of parts.slice(1)) {
    const newline = part.indexOf("\n");
    const heading = part.slice(0, newline).trim();
    const body = part.slice(newline + 1);
    result.set(heading, body);
  }
  return result;
};

const buildH3Block = (heading: string, body: string): string => {
  return `### ${heading}\n${body}`;
};

const processCLI = async (): Promise<OutputFile[]> => {
  const raw = await fs.readFile(path.join(DOCS_ROOT, "CLI.md"), "utf-8");
  const withoutTitle = raw.replace(/^# .+\n\n?/, "");

  const h2Sections = splitByH2(withoutTitle);
  const commandsH2 = h2Sections.get("Commands") ?? "";
  const h3Sections = splitByH3(commandsH2);

  const outputs: OutputFile[] = [];

  for (const group of CLI_GROUPS) {
    const bodyParts: string[] = [];

    if (group.h2) {
      for (const h2 of group.h2) {
        const content = h2Sections.get(h2);
        if (content) {
          bodyParts.push(`## ${h2}\n${content.trimEnd()}`);
        }
      }
    }

    if (group.h3Prefixes) {
      for (const [heading, body] of h3Sections) {
        const matches = group.h3Prefixes.some((prefix) => {
          return heading.startsWith(prefix);
        });
        if (matches) {
          bodyParts.push(buildH3Block(heading, body.trimEnd()));
        }
      }
    }

    if (bodyParts.length === 0) {
      console.warn(`[warn] No content found for: ${group.output}`);
      continue;
    }

    outputs.push({
      outputPath: group.output + ".mdx",
      title: group.title,
      description: group.description,
      body: bodyParts.join("\n\n"),
    });
  }

  return outputs;
};

const buildFrontmatter = (title: string, description: string): string => {
  return `---\ntitle: ${title}\ndescription: ${description}\n---\n\n`;
};

const writeOutputFile = async (file: OutputFile): Promise<void> => {
  const fullPath = path.join(OUTPUT_ROOT, file.outputPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  const content = buildFrontmatter(file.title, file.description) + file.body;
  await fs.writeFile(fullPath, content, "utf-8");
  console.log(`[ok] Generated: content/docs/${file.outputPath}`);
};

const writeMetaFiles = async (files: OutputFile[]): Promise<void> => {
  const rootMeta = { pages: ["cli"] };
  await fs.writeFile(
    path.join(OUTPUT_ROOT, "meta.json"),
    JSON.stringify(rootMeta, null, 2),
    "utf-8",
  );

  const cliPages = files
    .filter((f) => {
      return f.outputPath.startsWith("cli/");
    })
    .map((f) => {
      return path.basename(f.outputPath, ".mdx");
    });

  const cliMeta = { title: "CLI", pages: cliPages };
  await fs.mkdir(path.join(OUTPUT_ROOT, "cli"), { recursive: true });
  await fs.writeFile(
    path.join(OUTPUT_ROOT, "cli", "meta.json"),
    JSON.stringify(cliMeta, null, 2),
    "utf-8",
  );

  console.log("[ok] Generated: content/docs/meta.json");
  console.log("[ok] Generated: content/docs/cli/meta.json");
};

const main = async () => {
  console.log("Generating docs...\n");

  const cliFiles = await processCLI();
  const allFiles = [...cliFiles];

  await Promise.all(allFiles.map(writeOutputFile));
  await writeMetaFiles(allFiles);

  console.log(`\nDone. ${allFiles.length} file(s) generated.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
