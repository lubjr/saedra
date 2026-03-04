import { input, select, confirm } from "@inquirer/prompts";
import { getConfig } from "./login.js";
import { selectProject } from "./helpers.js";
import type { ArchitectureState, Decision } from "../memory/schemas.js";

function requireAuth() {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }
  return config;
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const body = JSON.parse(text) as { error?: string };
    return body.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function promptList(message: string): Promise<string[]> {
  console.log(`  ${message} (enter each item, empty line to finish)`);
  const items: string[] = [];
  let i = 1;
  while (true) {
    const item = await input({ message: `  [${i}]` });
    if (!item.trim()) break;
    items.push(item.trim());
    i++;
  }
  return items;
}

export async function memoryStateCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents?type=architecture`,
      { headers: { Authorization: `Bearer ${config.token}` } }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to fetch architecture state: ${error}`);
      process.exit(1);
    }

    const docs = (await res.json()) as Array<{ id: string; name: string; content: string }>;

    if (!docs.length) {
      console.log(
        "\nNo architecture state found. Create one with: saedra memory state update\n"
      );
      return;
    }

    const latest = docs[0]!;
    const detailRes = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents/${latest.id}`,
      { headers: { Authorization: `Bearer ${config.token}` } }
    );

    if (!detailRes.ok) {
      const error = await parseError(detailRes);
      console.error(`\nFailed to read architecture state: ${error}`);
      process.exit(1);
    }

    const result = (await detailRes.json()) as { data?: { content: string }; content?: string };
    const content = (result as any).data?.content ?? (result as any).content ?? "";

    let state: ArchitectureState;
    try {
      state = JSON.parse(content) as ArchitectureState;
    } catch {
      console.error("\nArchitecture state is malformed. Re-create with: saedra memory state update\n");
      process.exit(1);
    }

    console.log(`\n  Architecture State — ${project.name}`);
    console.log(`  Version: ${state.version}\n`);
    console.log(`  Summary:\n    ${state.summary}\n`);

    if (state.core_principles?.length) {
      console.log("  Core Principles:");
      for (const p of state.core_principles) console.log(`    - ${p}`);
    }
    if (state.critical_paths?.length) {
      console.log("\n  Critical Paths:");
      for (const p of state.critical_paths) console.log(`    - ${p}`);
    }
    if (state.constraints?.length) {
      console.log("\n  Constraints:");
      for (const c of state.constraints) console.log(`    - ${c}`);
    }
    if (state.active_decisions?.length) {
      console.log("\n  Active Decisions:");
      for (const d of state.active_decisions) console.log(`    - ${d}`);
    }
    console.log();
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function memoryStateUpdateCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  console.log("\n  Architecture State — Update\n");

  const summary = await input({ message: "Summary (describe the current architecture):" });
  if (!summary.trim()) {
    console.error("Summary cannot be empty.");
    process.exit(1);
  }

  const core_principles = await promptList("Core principles:");
  const critical_paths = await promptList("Critical paths:");
  const constraints = await promptList("Constraints:");
  const active_decisions = await promptList("Active decision IDs (e.g. DEC-2026-03-04-auth):");

  const state: ArchitectureState = {
    version: today(),
    summary: summary.trim(),
    core_principles,
    critical_paths,
    constraints,
    active_decisions,
  };

  const confirmed = await confirm({
    message: "Save this architecture state?",
    default: true,
  });

  if (!confirmed) {
    console.log("\nAborted.\n");
    return;
  }

  await upsertArchitectureState(config, project, state);
}

async function upsertArchitectureState(
  config: Awaited<ReturnType<typeof getConfig>> & object,
  project: { id: string; name: string },
  state: ArchitectureState
) {
  const content = JSON.stringify(state, null, 2);
  const name = "architecture-state.json";

  try {
    const listRes = await fetch(
      `${config!.apiUrl}/projects/${project.id}/documents?type=architecture`,
      { headers: { Authorization: `Bearer ${config!.token}` } }
    );

    let existingId: string | null = null;
    if (listRes.ok) {
      const docs = (await listRes.json()) as Array<{ id: string; name: string }>;
      existingId = docs.find((d) => d.name === name)?.id ?? null;
    }

    if (existingId) {
      const res = await fetch(
        `${config!.apiUrl}/projects/${project.id}/documents/${existingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config!.token}`,
          },
          body: JSON.stringify({ content }),
        }
      );
      if (!res.ok) {
        const error = await parseError(res);
        console.error(`\nFailed to update architecture state: ${error}`);
        process.exit(1);
      }
      console.log("\nArchitecture state updated successfully.\n");
    } else {
      const res = await fetch(`${config!.apiUrl}/projects/${project.id}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config!.token}`,
        },
        body: JSON.stringify({ name, content, type: "architecture" }),
      });
      if (!res.ok) {
        const error = await parseError(res);
        console.error(`\nFailed to create architecture state: ${error}`);
        process.exit(1);
      }
      console.log("\nArchitecture state created successfully.\n");
    }
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function memoryDecisionAddCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  console.log("\n  New Decision\n");

  const title = await input({ message: "Title:" });
  if (!title.trim()) {
    console.error("Title cannot be empty.");
    process.exit(1);
  }

  const context = await input({ message: "Context (why was this decision needed?):" });
  const decision = await input({ message: "Decision (what was decided?):" });
  const risk_level = await select({
    message: "Risk level:",
    choices: [
      { name: "low", value: "low" },
      { name: "medium", value: "medium" },
      { name: "high", value: "high" },
    ],
  });

  const impact = await promptList("Impact:");
  const affects = await promptList("Affected modules/domains:");
  const constraints_introduced = await promptList("Constraints introduced:");

  const supersedes = await input({
    message: "Supersedes (decision ID, leave empty if none):",
  });

  const id = `DEC-${today()}-${slugify(title)}`;

  const dec: Decision = {
    id,
    title: title.trim(),
    status: "active",
    context: context.trim(),
    decision: decision.trim(),
    impact,
    affects,
    constraints_introduced,
    supersedes: supersedes.trim() || null,
    risk_level: risk_level as Decision["risk_level"],
    created_at: new Date().toISOString(),
  };

  const confirmed = await confirm({
    message: `Save decision "${id}"?`,
    default: true,
  });

  if (!confirmed) {
    console.log("\nAborted.\n");
    return;
  }

  try {
    const res = await fetch(`${config.apiUrl}/projects/${project.id}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify({
        name: `${id}.json`,
        content: JSON.stringify(dec, null, 2),
        type: "decision",
      }),
    });

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to save decision: ${error}`);
      process.exit(1);
    }

    console.log(`\nDecision "${id}" saved successfully.\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function memoryDecisionListCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents?type=decision`,
      { headers: { Authorization: `Bearer ${config.token}` } }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to list decisions: ${error}`);
      process.exit(1);
    }

    const docs = (await res.json()) as Array<{
      id: string;
      name: string;
      content: string;
      created_at: string;
    }>;

    if (!docs.length) {
      console.log("\nNo decisions found. Add one with: saedra memory decision add\n");
      return;
    }

    console.log(`\n  Decisions — ${project.name}\n`);

    for (const doc of docs) {
      try {
        const dec = JSON.parse(doc.content) as Decision;
        const badge = dec.risk_level === "high" ? "[HIGH]" : dec.risk_level === "medium" ? "[MED]" : "[LOW]";
        const status = dec.status === "active" ? "active" : dec.status;
        console.log(`  ${dec.id}`);
        console.log(`    Title:    ${dec.title}`);
        console.log(`    Status:   ${status}  Risk: ${badge}`);
        console.log(`    Decision: ${dec.decision}`);
        if (dec.affects?.length) console.log(`    Affects:  ${dec.affects.join(", ")}`);
        console.log();
      } catch {
        console.log(`  ${doc.name} (malformed)\n`);
      }
    }
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}
