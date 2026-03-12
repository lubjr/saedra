import { getConfig } from "./login.js";
import { selectProject } from "./helpers.js";
import type { ArchitectureState, Decision, ChangeEvent } from "../memory/schemas.js";

function requireAuth() {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }
  return config;
}

async function fetchState(
  apiUrl: string,
  projectId: string,
  token: string
): Promise<ArchitectureState | null> {
  const res = await fetch(`${apiUrl}/projects/${projectId}/documents?type=architecture`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;

  const docs = (await res.json()) as Array<{ id: string; content: string }>;
  if (!docs.length) return null;

  const detailRes = await fetch(`${apiUrl}/projects/${projectId}/documents/${docs[0]!.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!detailRes.ok) return null;

  const result = (await detailRes.json()) as { data?: { content: string }; content?: string };
  const content = (result as any).data?.content ?? (result as any).content ?? "";
  try {
    return JSON.parse(content) as ArchitectureState;
  } catch {
    return null;
  }
}

async function fetchDecisions(
  apiUrl: string,
  projectId: string,
  token: string
): Promise<Decision[]> {
  const res = await fetch(`${apiUrl}/projects/${projectId}/documents?type=decision`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];

  const docs = (await res.json()) as Array<{ id: string; content: string }>;
  const decisions: Decision[] = [];
  for (const doc of docs) {
    try {
      const dec = JSON.parse(doc.content) as Decision;
      if (dec.status === "active") decisions.push(dec);
    } catch { /* skip malformed */ }
  }
  return decisions;
}

async function fetchChanges(
  apiUrl: string,
  projectId: string,
  token: string,
  limit = 5
): Promise<ChangeEvent[]> {
  const res = await fetch(`${apiUrl}/projects/${projectId}/documents?type=change`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];

  const docs = (await res.json()) as Array<{ id: string; content: string }>;
  const changes: ChangeEvent[] = [];
  for (const doc of docs) {
    try {
      changes.push(JSON.parse(doc.content) as ChangeEvent);
    } catch { /* skip malformed */ }
  }
  return changes.slice(0, limit);
}

export async function contextCommand(opts: { json?: boolean } = {}) {
  const config = requireAuth();
  const project = await selectProject(config);

  try {
    const [state, decisions, changes] = await Promise.all([
      fetchState(config.apiUrl, project.id, config.token),
      fetchDecisions(config.apiUrl, project.id, config.token),
      fetchChanges(config.apiUrl, project.id, config.token),
    ]);

    if (opts.json) {
      console.log(JSON.stringify({ project: project.name, state, decisions, changes }, null, 2));
      return;
    }

    console.log(`\n  [ARCHITECTURE CONTEXT — ${project.name}]\n`);

    if (state) {
      console.log(`  Summary:\n    ${state.summary}\n`);

      if (state.core_principles?.length) {
        console.log("  Core Principles:");
        for (const p of state.core_principles) console.log(`    - ${p}`);
        console.log();
      }

      if (state.critical_paths?.length) {
        console.log("  Critical Paths:");
        for (const p of state.critical_paths) console.log(`    - ${p}`);
        console.log();
      }

      if (state.constraints?.length) {
        console.log("  Constraints:");
        for (const c of state.constraints) console.log(`    - ${c}`);
        console.log();
      }
    } else {
      console.log("  No architecture state found. Run: saedra memory state update\n");
    }

    if (decisions.length) {
      console.log(`  Active Decisions (${decisions.length}):`);
      for (const d of decisions) console.log(`    - ${d.id}`);
      console.log();
    }

    if (changes.length) {
      console.log(`  Recent Changes (${changes.length}):`);
      for (const c of changes) console.log(`    - ${c.id} — ${c.summary}`);
      console.log();
    }
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function explainCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  try {
    const [state, decisions, changes] = await Promise.all([
      fetchState(config.apiUrl, project.id, config.token),
      fetchDecisions(config.apiUrl, project.id, config.token),
      fetchChanges(config.apiUrl, project.id, config.token),
    ]);

    console.log(`\n  ${project.name} — Architecture Overview\n`);

    if (state) {
      console.log(`  What is this project?\n    ${state.summary}\n`);

      if (state.critical_paths?.length) {
        console.log("  Communication Patterns:");
        for (const p of state.critical_paths) console.log(`    - ${p}`);
        console.log();
      }

      if (state.core_principles?.length) {
        console.log("  Core Principles:");
        for (const p of state.core_principles) console.log(`    - ${p}`);
        console.log();
      }

      if (state.constraints?.length) {
        console.log("  Constraints:");
        for (const c of state.constraints) console.log(`    - ${c}`);
        console.log();
      }
    } else {
      console.log("  No architecture state found. Run: saedra memory state update\n");
    }

    if (decisions.length) {
      console.log("  Key Decisions:");
      for (const d of decisions) console.log(`    - ${d.title} (${d.id})`);
      console.log();
    }

    if (changes.length) {
      console.log("  Recent Changes:");
      for (const c of changes) {
        const date = c.id.match(/CHG-(\d{4}-\d{2}-\d{2})/)?.[1] ?? "";
        console.log(`    - ${date ? `[${date}] ` : ""}${c.summary}`);
      }
      console.log();
    }
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}
