import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { select } from "@inquirer/prompts";
import { getConfig } from "./login.js";
import type { SaedraConfig } from "./login.js";
import { findSaedraContext } from "./context.js";
import type { ArchitectureState, Decision, ChangeEvent, ViolationRule } from "../memory/schemas.js";

const LOCAL_CONTEXT_FILE = ".saedra-context.json";

export interface LocalContext {
  generated_at: string;
  state: ArchitectureState | null;
  decisions: Decision[];
  changes: ChangeEvent[];
  rules: ViolationRule[];
}

export function loadLocalContext(startDir: string = process.cwd()): LocalContext | null {
  let dir = startDir;
  while (true) {
    const filePath = join(dir, LOCAL_CONTEXT_FILE);
    if (existsSync(filePath)) {
      try {
        return JSON.parse(readFileSync(filePath, "utf-8")) as LocalContext;
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

export function isContextFresh(context: LocalContext, maxAgeMinutes = 60): boolean {
  const generated = new Date(context.generated_at).getTime();
  if (isNaN(generated)) return false;
  return Date.now() - generated < maxAgeMinutes * 60 * 1000;
}

export function requireAuth(): SaedraConfig {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }
  return config;
}

export async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const body = JSON.parse(text) as { error?: string };
    return body.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export function handleFetchError(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\nFailed to connect to server: ${message}`);
  process.exit(1);
}

export async function selectProject(config: SaedraConfig): Promise<{ id: string; name: string }> {
  const context = findSaedraContext();
  if (context) {
    console.error(`Using project: ${context.projectName} (from .saedra)`);
    return { id: context.projectId, name: context.projectName };
  }

  const res = await fetch(`${config.apiUrl}/projects/user/${config.userId}`, {
    headers: { Authorization: `Bearer ${config.token}` },
  });

  if (!res.ok) {
    console.error("\nFailed to fetch projects.");
    process.exit(1);
  }

  const projects = (await res.json()) as Array<{ id: string; name: string }>;

  if (!projects.length) {
    console.error("\nNo projects found. Create one with: saedra project create");
    process.exit(1);
  }

  const id = await select({
    message: "Select a project:",
    choices: projects.map((p) => ({ name: p.name, value: p.id })),
  });

  const name = projects.find((p) => p.id === id)!.name;
  return { id, name };
}

export async function selectDocument(
  config: SaedraConfig,
  projectId: string
): Promise<{ id: string; name: string }> {
  const res = await fetch(`${config.apiUrl}/projects/${projectId}/documents`, {
    headers: { Authorization: `Bearer ${config.token}` },
  });

  if (!res.ok) {
    console.error("\nFailed to fetch documents.");
    process.exit(1);
  }

  const documents = (await res.json()) as Array<{ id: string; name: string }>;

  if (!documents.length) {
    console.error("\nNo documents found. Create one with: saedra doc create");
    process.exit(1);
  }

  const id = await select({
    message: "Select a document:",
    choices: documents.map((d) => ({ name: d.name, value: d.id })),
  });

  const name = documents.find((d) => d.id === id)!.name;
  return { id, name };
}
