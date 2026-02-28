import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { getConfig } from "./login.js";
import { selectProject } from "./helpers.js";

const CONTEXT_FILE = ".saedra";

export interface SaedraContext {
  projectId: string;
  projectName: string;
}

export function findSaedraContext(): SaedraContext | null {
  let dir = process.cwd();

  while (true) {
    const filePath = join(dir, CONTEXT_FILE);
    if (existsSync(filePath)) {
      try {
        return JSON.parse(readFileSync(filePath, "utf-8")) as SaedraContext;
      } catch {
        return null;
      }
    }

    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

export async function initCommand() {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }

  const project = await selectProject(config);

  const context: SaedraContext = {
    projectId: project.id,
    projectName: project.name,
  };

  writeFileSync(CONTEXT_FILE, JSON.stringify(context, null, 2) + "\n");

  console.log(`\nLinked to project ${project.name}. Created ${CONTEXT_FILE}\n`);
}
