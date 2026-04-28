import { writeFileSync } from "node:fs";
import { selectProject, requireAuth, handleFetchError, loadLocalContext, isContextFresh } from "./helpers.js";
import type { ArchitectureState, Decision, ChangeEvent, ViolationRule } from "../memory/schemas.js";

export async function fetchState(
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

export async function fetchDecisions(
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

export async function fetchChanges(
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

export async function fetchRules(
  apiUrl: string,
  projectId: string,
  token: string
): Promise<ViolationRule[]> {
  const res = await fetch(`${apiUrl}/projects/${projectId}/documents?type=rule`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];

  const docs = (await res.json()) as Array<{ id: string; content: string }>;
  const rules: ViolationRule[] = [];
  for (const doc of docs) {
    try {
      rules.push(JSON.parse(doc.content) as ViolationRule);
    } catch { /* skip malformed */ }
  }
  return rules;
}

export async function contextCommand(opts: { json?: boolean; copy?: boolean; offline?: boolean } = {}) {
  const config = requireAuth();
  const project = await selectProject(config);

  let state: ArchitectureState | null;
  let decisions: Decision[];
  let changes: ChangeEvent[];
  let rules: ViolationRule[];

  if (opts.offline) {
    const localCtx = loadLocalContext();
    if (!localCtx) {
      console.error("\n  No .saedra-context.json found. Run: saedra memory compress\n");
      process.exit(1);
    }
    state = localCtx.state;
    decisions = localCtx.decisions;
    changes = localCtx.changes;
    rules = localCtx.rules;
    console.error(`\n  ⚠  Using local snapshot (generated_at: ${localCtx.generated_at})`);
    if (!isContextFresh(localCtx)) {
      console.error(`     ⚠  Snapshot is older than 60 minutes. Results may be outdated.`);
    }
  } else {
    try {
      [state, decisions, changes, rules] = await Promise.all([
        fetchState(config.apiUrl, project.id, config.token),
        fetchDecisions(config.apiUrl, project.id, config.token),
        fetchChanges(config.apiUrl, project.id, config.token),
        fetchRules(config.apiUrl, project.id, config.token),
      ]);
    } catch (err) {
      const localCtx = loadLocalContext();
      if (!localCtx) {
        handleFetchError(err);
      }
      console.error(`\n  ⚠  Server unreachable — using local snapshot (generated_at: ${localCtx.generated_at})`);
      if (!isContextFresh(localCtx)) {
        console.error(`     ⚠  Snapshot is older than 60 minutes. Results may be outdated.`);
      }
      state = localCtx.state;
      decisions = localCtx.decisions;
      changes = localCtx.changes;
      rules = localCtx.rules;
    }
  }

  if (opts.json) {
    console.log(JSON.stringify({ project: project.name, state, decisions, changes, rules }, null, 2));
    return;
  }

  const lines: string[] = [];

  lines.push(`\n  [ARCHITECTURE CONTEXT — ${project.name}]\n`);

  if (state) {
    lines.push(`  Summary:\n    ${state.summary}\n`);

    if (state.core_principles?.length) {
      lines.push("  Core Principles:");
      for (const p of state.core_principles) lines.push(`    - ${p}`);
      lines.push("");
    }

    if (state.critical_paths?.length) {
      lines.push("  Critical Paths:");
      for (const p of state.critical_paths) lines.push(`    - ${p}`);
      lines.push("");
    }

    if (state.constraints?.length) {
      lines.push("  Constraints:");
      for (const c of state.constraints) lines.push(`    - ${c}`);
      lines.push("");
    }
  } else {
    lines.push("  No architecture state found. Run: saedra memory state update\n");
  }

  if (decisions.length) {
    lines.push(`  Active Decisions (${decisions.length}):`);
    for (const d of decisions) lines.push(`    - ${d.id}`);
    lines.push("");
  }

  if (changes.length) {
    lines.push(`  Recent Changes (${changes.length}):`);
    for (const c of changes) lines.push(`    - ${c.id} — ${c.summary}`);
    lines.push("");
  }

  if (rules.length) {
    lines.push(`  Violation Rules (${rules.length}):`);
    for (const r of rules) {
      const badge = r.severity === "high" ? "[HIGH]" : r.severity === "medium" ? "[MED]" : "[LOW]";
      lines.push(`    - ${r.id} ${badge} — ${r.description}`);
    }
    lines.push("");
  }

  const output = lines.join("\n");

  if (opts.copy) {
    const { default: clipboardy } = await import("clipboardy");
    await clipboardy.write(output);
    console.log(`\n  Context copied to clipboard. (${project.name})\n`);
  } else {
    console.log(output);
  }
}

export async function memoryCompressCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  console.log(`\n  Compressing architecture context — ${project.name}\n`);

  try {
    process.stdout.write("  Fetching architecture state...    ");
    const state = await fetchState(config.apiUrl, project.id, config.token);
    console.log("✓");

    process.stdout.write("  Fetching active decisions...      ");
    const decisions = await fetchDecisions(config.apiUrl, project.id, config.token);
    console.log(`✓ (${decisions.length})`);

    process.stdout.write("  Fetching recent changes...        ");
    const changes = await fetchChanges(config.apiUrl, project.id, config.token, 10);
    console.log(`✓ (${changes.length})`);

    process.stdout.write("  Fetching violation rules...       ");
    const rules = await fetchRules(config.apiUrl, project.id, config.token);
    console.log(`✓ (${rules.length})`);

    const snapshot = {
      project: project.name,
      project_id: project.id,
      generated_at: new Date().toISOString(),
      state,
      decisions,
      changes,
      rules,
    };

    writeFileSync(".saedra-context.json", JSON.stringify(snapshot, null, 2) + "\n");

    console.log("\n  Saved: .saedra-context.json\n");
  } catch (err) {
    handleFetchError(err);
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
    handleFetchError(err);
  }
}
