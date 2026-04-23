import { execSync } from "node:child_process";
import { input, select, confirm } from "@inquirer/prompts";
import { getAiConfig } from "./ai.js";
import { streamAI } from "./ai-client.js";
import { selectProject, requireAuth, parseError } from "./helpers.js";
import type { SaedraConfig } from "./login.js";
import type { ArchitectureState, Decision, ChangeEvent, ViolationRule } from "../memory/schemas.js";

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
  config: SaedraConfig,
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

export async function memoryChangeLogCommand(fromGit = false, noPrompt = false) {
  const config = requireAuth();
  const project = await selectProject(config);

  if (noPrompt) {
    if (!fromGit) {
      console.error("--no-prompt requires --from-git.");
      process.exit(1);
    }

    let summary = "";
    let files_changed: string[] = [];

    try {
      summary = execSync("git log -1 --pretty=%s").toString().trim();
      const diff = execSync("git diff --name-only HEAD~1 HEAD").toString().trim();
      files_changed = diff.split("\n").filter(Boolean);
    } catch {
      console.error("\nFailed to read git context. Skipping change event.\n");
      process.exit(1);
    }

    if (!summary) {
      console.log("Empty commit message, skipping change event.\n");
      return;
    }

    const id = `CHG-${today()}-${slugify(summary)}`;
    const change: ChangeEvent = {
      id,
      summary,
      related_decisions: [],
      files_changed,
      architectural_impact: "",
      risk_assessment: "",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${config.apiUrl}/projects/${project.id}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token}`,
        },
        body: JSON.stringify({
          name: `${id}.json`,
          content: JSON.stringify(change, null, 2),
          type: "change",
        }),
      });

      if (!res.ok) {
        const error = await parseError(res);
        console.error(`\nFailed to save change event: ${error}`);
        process.exit(1);
      }

      console.log(`Change event "${id}" saved.`);
    } catch (err) {
      console.error("Failed to connect to server:", (err as Error).message);
      process.exit(1);
    }
    return;
  }

  console.log("\n  New Change Event\n");

  let summary = "";
  let prefillFiles: string[] = [];

  if (fromGit) {
    try {
      summary = execSync("git log -1 --pretty=%s").toString().trim();
      const diff = execSync("git diff --name-only HEAD~1 HEAD").toString().trim();
      prefillFiles = diff.split("\n").filter(Boolean);
    } catch {
      console.error(
        "\nFailed to read git context. Make sure you are inside a git repository with at least one commit.\n"
      );
      process.exit(1);
    }
  }

  const summaryInput = await input({
    message: "Summary:",
    default: summary || undefined,
  });
  if (!summaryInput.trim()) {
    console.error("Summary cannot be empty.");
    process.exit(1);
  }

  let files_changed: string[];
  if (fromGit && prefillFiles.length) {
    console.log(`\n  Files changed (pre-filled from git):`);
    for (const f of prefillFiles) console.log(`    ${f}`);
    const keep = await confirm({
      message: "Use these files?",
      default: true,
    });
    files_changed = keep ? prefillFiles : await promptList("Files changed:");
  } else {
    files_changed = await promptList("Files changed:");
  }

  const architectural_impact = await input({ message: "Architectural impact:" });
  const risk_assessment = await input({ message: "Risk assessment:" });
  const related_decisions = await promptList(
    "Related decision IDs (e.g. DEC-2026-03-04-auth):"
  );

  const id = `CHG-${today()}-${slugify(summaryInput)}`;

  const change: ChangeEvent = {
    id,
    summary: summaryInput.trim(),
    related_decisions,
    files_changed,
    architectural_impact: architectural_impact.trim(),
    risk_assessment: risk_assessment.trim(),
    created_at: new Date().toISOString(),
  };

  const confirmed = await confirm({
    message: `Save change "${id}"?`,
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
        content: JSON.stringify(change, null, 2),
        type: "change",
      }),
    });

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to save change event: ${error}`);
      process.exit(1);
    }

    console.log(`\nChange event "${id}" saved successfully.\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function memoryChangeListCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents?type=change`,
      { headers: { Authorization: `Bearer ${config.token}` } }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to list changes: ${error}`);
      process.exit(1);
    }

    const docs = (await res.json()) as Array<{
      id: string;
      name: string;
      content: string;
      created_at: string;
    }>;

    if (!docs.length) {
      console.log(
        "\nNo change events found. Log one with: saedra memory change log\n"
      );
      return;
    }

    console.log(`\n  Change Timeline — ${project.name}\n`);

    for (const doc of docs) {
      try {
        const chg = JSON.parse(doc.content) as ChangeEvent;
        console.log(`  ${chg.id}`);
        console.log(`    Summary: ${chg.summary}`);
        if (chg.architectural_impact)
          console.log(`    Impact:  ${chg.architectural_impact}`);
        if (chg.risk_assessment)
          console.log(`    Risk:    ${chg.risk_assessment}`);
        if (chg.files_changed?.length)
          console.log(`    Files:   ${chg.files_changed.join(", ")}`);
        if (chg.related_decisions?.length)
          console.log(`    Decisions: ${chg.related_decisions.join(", ")}`);
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

export async function memoryRuleAddCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  console.log("\n  New Violation Rule\n");

  const description = await input({ message: "Description (what must not happen?):" });
  if (!description.trim()) {
    console.error("Description cannot be empty.");
    process.exit(1);
  }

  const severity = await select({
    message: "Severity:",
    choices: [
      { name: "high", value: "high" },
      { name: "medium", value: "medium" },
      { name: "low", value: "low" },
    ],
  });

  const related_decision = await input({
    message: "Related decision (ID, leave empty if none):",
  });

  const id = `RULE-${today()}-${slugify(description)}`;

  const rule: ViolationRule = {
    id,
    description: description.trim(),
    severity: severity as ViolationRule["severity"],
    related_decision: related_decision.trim() || null,
    created_at: new Date().toISOString(),
  };

  const confirmed = await confirm({
    message: `Save rule "${id}"?`,
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
        content: JSON.stringify(rule, null, 2),
        type: "rule",
      }),
    });

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to save rule: ${error}`);
      process.exit(1);
    }

    console.log(`\nRule "${id}" saved successfully.\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function memoryRuleListCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents?type=rule`,
      { headers: { Authorization: `Bearer ${config.token}` } }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to list rules: ${error}`);
      process.exit(1);
    }

    const docs = (await res.json()) as Array<{
      id: string;
      name: string;
      content: string;
      created_at: string;
    }>;

    if (!docs.length) {
      console.log("\nNo rules found. Add one with: saedra memory rule add\n");
      return;
    }

    console.log(`\n  Violation Rules — ${project.name}\n`);

    for (const doc of docs) {
      try {
        const rule = JSON.parse(doc.content) as ViolationRule;
        const badge = rule.severity === "high" ? "[HIGH]" : rule.severity === "medium" ? "[MED]" : "[LOW]";
        console.log(`  ${rule.id}  ${badge}`);
        console.log(`    Constraint: ${rule.description}`);
        if (rule.related_decision) console.log(`    Decision:   ${rule.related_decision}`);
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

export async function memoryStateUpdateAiCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  const aiConfig = getAiConfig();
  if (!aiConfig) {
    console.error("\n  AI not configured. Run: saedra ai setup\n");
    process.exit(1);
  }

  console.log("\n  AI Architecture Compression\n");
  console.log("  Fetching project memory...");

  try {
    const [decisionsRes, changesRes, stateRes] = await Promise.all([
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=decision`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=change`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=architecture`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
    ]);

    const decisionDocs = decisionsRes.ok
      ? ((await decisionsRes.json()) as Array<{ content: string }>)
      : [];
    const decisions = decisionDocs
      .map((d) => { try { return JSON.parse(d.content) as Decision; } catch { return null; } })
      .filter((d): d is Decision => d !== null && d.status === "active");

    const changeDocs = changesRes.ok
      ? ((await changesRes.json()) as Array<{ content: string }>)
      : [];
    const changes = changeDocs
      .slice(0, 10)
      .map((d) => { try { return JSON.parse(d.content) as ChangeEvent; } catch { return null; } })
      .filter((c): c is ChangeEvent => c !== null);

    let currentState: ArchitectureState | null = null;
    if (stateRes.ok) {
      const stateDocs = (await stateRes.json()) as Array<{ content: string }>;
      if (stateDocs.length) {
        try { currentState = JSON.parse(stateDocs[0]!.content) as ArchitectureState; } catch { /* ignore */ }
      }
    }

    if (!decisions.length && !changes.length) {
      console.error("\n  No decisions or changes found. Add some before using AI compression.\n");
      process.exit(1);
    }

    console.log(`  Found ${decisions.length} active decision(s) and ${changes.length} change event(s).`);
    console.log("  Sending to AI for compression...\n");

    const prompt = buildCompressionPrompt(project.name, decisions, changes, currentState);

    const chunks: string[] = [];
    process.stdout.write("  Thinking");

    await streamAI(
      "You are an expert software architect. Compress architectural context into a structured JSON object. " +
        "Return ONLY valid JSON matching the ArchitectureState schema — no markdown, no explanation, just the JSON object.",
      prompt,
      aiConfig,
      (text) => { chunks.push(text); process.stdout.write("."); },
      { smart: true }
    );

    process.stdout.write("\n\n");

    const stateJson = chunks.join("").trim();
    if (!stateJson) {
      console.error("  AI returned no response.\n");
      process.exit(1);
    }

    let proposed: ArchitectureState;
    try {
      const cleaned = stateJson.replace(/^```json?\s*/m, "").replace(/\s*```$/m, "").trim();
      proposed = JSON.parse(cleaned) as ArchitectureState;
    } catch {
      console.error("  Claude returned invalid JSON:\n\n", stateJson, "\n");
      process.exit(1);
    }

    proposed.version = today();

    console.log("  Proposed Architecture State:\n");
    console.log(`  Summary:\n    ${proposed.summary}\n`);
    if (proposed.core_principles?.length) {
      console.log("  Core Principles:");
      for (const p of proposed.core_principles) console.log(`    - ${p}`);
    }
    if (proposed.critical_paths?.length) {
      console.log("\n  Critical Paths:");
      for (const p of proposed.critical_paths) console.log(`    - ${p}`);
    }
    if (proposed.constraints?.length) {
      console.log("\n  Constraints:");
      for (const c of proposed.constraints) console.log(`    - ${c}`);
    }
    if (proposed.active_decisions?.length) {
      console.log("\n  Active Decisions:");
      for (const d of proposed.active_decisions) console.log(`    - ${d}`);
    }
    console.log();

    const confirmed = await confirm({
      message: "Save this as the new architecture state?",
      default: true,
    });

    if (!confirmed) {
      console.log("\nAborted.\n");
      return;
    }

    await upsertArchitectureState(config, project, proposed);
  } catch (err) {
    console.error("\n  Failed:", (err as Error).message, "\n");
    process.exit(1);
  }
}

function buildCompressionPrompt(
  projectName: string,
  decisions: Decision[],
  changes: ChangeEvent[],
  current: ArchitectureState | null
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push("");

  if (current) {
    parts.push("## Current Architecture State");
    parts.push(JSON.stringify(current, null, 2));
    parts.push("");
  }

  if (decisions.length) {
    parts.push("## Active Decisions");
    for (const d of decisions) {
      parts.push(`### ${d.id}: ${d.title}`);
      parts.push(`Context: ${d.context}`);
      parts.push(`Decision: ${d.decision}`);
      parts.push(`Affects: ${d.affects.join(", ")}`);
      parts.push(`Risk: ${d.risk_level}`);
      parts.push("");
    }
  }

  if (changes.length) {
    parts.push("## Recent Changes (last 10)");
    for (const c of changes) {
      parts.push(`### ${c.id}: ${c.summary}`);
      if (c.architectural_impact) parts.push(`Impact: ${c.architectural_impact}`);
      if (c.files_changed?.length) parts.push(`Files: ${c.files_changed.join(", ")}`);
      parts.push("");
    }
  }

  parts.push("## Task");
  parts.push(
    "Based on the above, generate a compressed ArchitectureState JSON object with exactly these fields:\n" +
    "- version: string (YYYY-MM-DD)\n" +
    "- summary: string (1-3 sentences capturing the essence of the current architecture)\n" +
    "- core_principles: string[] (3-6 key engineering principles in use)\n" +
    "- critical_paths: string[] (3-5 most important data/request flows)\n" +
    "- constraints: string[] (hard constraints: Node version, package manager, required env vars, etc.)\n" +
    `- active_decisions: string[] (IDs of active decisions exactly as listed above)`
  );

  return parts.join("\n");
}

export async function memoryChangeAnalyzeCommand(changeIdArg?: string) {
  const config = requireAuth();
  const project = await selectProject(config);

  const aiConfig = getAiConfig();
  if (!aiConfig) {
    console.error("\n  AI not configured. Run: saedra ai setup\n");
    process.exit(1);
  }

  try {
    const [decisionsRes, changesRes, stateRes, rulesRes] = await Promise.all([
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=decision`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=change`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=architecture`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=rule`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
    ]);

    const changeDocs = changesRes.ok
      ? ((await changesRes.json()) as Array<{ content: string }>)
      : [];

    if (!changeDocs.length) {
      console.error("\n  No change events found. Log one with: saedra memory change log\n");
      process.exit(1);
    }

    const allChanges = changeDocs
      .map((d) => { try { return JSON.parse(d.content) as ChangeEvent; } catch { return null; } })
      .filter((c): c is ChangeEvent => c !== null);

    let target: ChangeEvent | undefined;
    if (changeIdArg) {
      target = allChanges.find((c) => c.id === changeIdArg);
      if (!target) {
        console.error(`\n  Change "${changeIdArg}" not found.\n`);
        process.exit(1);
      }
    } else {
      target = allChanges[0];
    }

    if (!target) {
      console.error("\n  No change events found.\n");
      process.exit(1);
    }

    const decisionDocs = decisionsRes.ok
      ? ((await decisionsRes.json()) as Array<{ content: string }>)
      : [];
    const decisions = decisionDocs
      .map((d) => { try { return JSON.parse(d.content) as Decision; } catch { return null; } })
      .filter((d): d is Decision => d !== null && d.status === "active");

    const ruleDocs = rulesRes.ok
      ? ((await rulesRes.json()) as Array<{ content: string }>)
      : [];
    const rules = ruleDocs
      .map((d) => { try { return JSON.parse(d.content) as ViolationRule; } catch { return null; } })
      .filter((r): r is ViolationRule => r !== null);

    let state: ArchitectureState | null = null;
    if (stateRes.ok) {
      const stateDocs = (await stateRes.json()) as Array<{ id: string; content: string }>;
      if (stateDocs.length) {
        const detailRes = await fetch(
          `${config.apiUrl}/projects/${project.id}/documents/${stateDocs[0]!.id}`,
          { headers: { Authorization: `Bearer ${config.token}` } }
        );
        if (detailRes.ok) {
          const result = (await detailRes.json()) as { data?: { content: string }; content?: string };
          const content = (result as any).data?.content ?? (result as any).content ?? "";
          try { state = JSON.parse(content) as ArchitectureState; } catch { /* ignore */ }
        }
      }
    }

    console.log("\n  AI Impact Analysis\n");
    console.log(`  Analyzing: ${target.id}`);
    console.log(`  Summary:   ${target.summary}`);
    if (target.files_changed?.length) {
      console.log(`  Files:     ${target.files_changed.join(", ")}`);
    }
    console.log();

    const prompt = buildChangeAnalysisPrompt(project.name, target, state, decisions, rules);

    const separator = "  " + "─".repeat(50);
    console.log(separator);

    await streamAI(
      "You are an expert software architect analyzing the architectural impact of a change event. " +
        "Be concrete and direct. Reference specific decisions, rules, and modules from the provided context. " +
        "Keep the analysis focused and actionable.",
      prompt,
      aiConfig,
      (text) => process.stdout.write(text)
    );

    process.stdout.write("\n");
    console.log(separator);
    console.log();
  } catch (err) {
    console.error("\n  Failed:", (err as Error).message, "\n");
    process.exit(1);
  }
}

function buildChangeAnalysisPrompt(
  projectName: string,
  change: ChangeEvent,
  state: ArchitectureState | null,
  decisions: Decision[],
  rules: ViolationRule[]
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push("");
  parts.push("## Change Event to Analyze");
  parts.push(`ID: ${change.id}`);
  parts.push(`Summary: ${change.summary}`);
  if (change.files_changed?.length) {
    parts.push(`Files changed: ${change.files_changed.join(", ")}`);
  }
  if (change.architectural_impact) {
    parts.push(`Recorded impact: ${change.architectural_impact}`);
  }
  if (change.risk_assessment) {
    parts.push(`Recorded risk: ${change.risk_assessment}`);
  }
  if (change.related_decisions?.length) {
    parts.push(`Related decisions (as recorded): ${change.related_decisions.join(", ")}`);
  }
  parts.push("");

  if (state) {
    parts.push("## Current Architecture State");
    parts.push(`Summary: ${state.summary}`);
    if (state.core_principles?.length) {
      parts.push(`Core Principles: ${state.core_principles.join("; ")}`);
    }
    if (state.constraints?.length) {
      parts.push(`Constraints: ${state.constraints.join("; ")}`);
    }
    parts.push("");
  }

  if (decisions.length) {
    parts.push("## Active Architectural Decisions");
    for (const d of decisions) {
      parts.push(`- ${d.id}: ${d.title}`);
      parts.push(`  Decision: ${d.decision}`);
      if (d.affects?.length) parts.push(`  Affects: ${d.affects.join(", ")}`);
      if (d.constraints_introduced?.length) {
        parts.push(`  Constraints: ${d.constraints_introduced.join(", ")}`);
      }
    }
    parts.push("");
  }

  if (rules.length) {
    parts.push("## Violation Rules");
    for (const r of rules) {
      parts.push(`- ${r.id} [${r.severity.toUpperCase()}]: ${r.description}`);
      if (r.related_decision) parts.push(`  Related to: ${r.related_decision}`);
    }
    parts.push("");
  }

  parts.push("## Task");
  parts.push(
    "Analyze the architectural impact of this change event. Structure your response as:\n" +
    "1. **Impact Summary** — what this change implies architecturally in 2-3 sentences\n" +
    "2. **Affected Decisions** — which active decisions are touched or reinforced by this change\n" +
    "3. **Rule Compliance** — whether this change respects or potentially violates any violation rules\n" +
    "4. **Risk Assessment** — low / medium / high with brief justification\n" +
    "5. **Overlooked Concerns** — anything the recorded impact or risk assessment missed (if applicable)"
  );

  return parts.join("\n");
}

export async function timelineCommand() {
  const config = requireAuth();
  const project = await selectProject(config);

  try {
    const [decisionsRes, changesRes] = await Promise.all([
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=decision`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
      fetch(`${config.apiUrl}/projects/${project.id}/documents?type=change`, {
        headers: { Authorization: `Bearer ${config.token}` },
      }),
    ]);

    const decisionDocs = decisionsRes.ok
      ? ((await decisionsRes.json()) as Array<{ content: string }>)
      : [];
    const changeDocs = changesRes.ok
      ? ((await changesRes.json()) as Array<{ content: string }>)
      : [];

    interface TimelineEntry {
      yearMonth: string;
      date: string;
      type: "DEC" | "CHG";
      label: string;
    }

    const entries: TimelineEntry[] = [];

    for (const doc of decisionDocs) {
      try {
        const dec = JSON.parse(doc.content) as Decision;
        const date = extractDateFromId(dec.id, dec.created_at);
        entries.push({ yearMonth: date.slice(0, 7), date, type: "DEC", label: dec.title });
      } catch { /* skip malformed */ }
    }

    for (const doc of changeDocs) {
      try {
        const chg = JSON.parse(doc.content) as ChangeEvent;
        const date = extractDateFromId(chg.id, chg.created_at);
        entries.push({ yearMonth: date.slice(0, 7), date, type: "CHG", label: chg.summary });
      } catch { /* skip malformed */ }
    }

    if (!entries.length) {
      console.log(
        "\n  No decisions or changes found. Start with:\n" +
        "    saedra memory decision add\n" +
        "    saedra memory change log\n"
      );
      return;
    }

    entries.sort((a, b) => a.date.localeCompare(b.date));

    const groups = new Map<string, TimelineEntry[]>();
    for (const entry of entries) {
      const group = groups.get(entry.yearMonth) ?? [];
      group.push(entry);
      groups.set(entry.yearMonth, group);
    }

    console.log(`\n  Architecture Timeline — ${project.name}\n`);

    for (const [yearMonth, groupEntries] of groups) {
      console.log(`  ${yearMonth}`);
      for (const entry of groupEntries) {
        console.log(`    [${entry.type}] ${entry.label}`);
      }
      console.log();
    }
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

function extractDateFromId(id: string, createdAt?: string): string {
  const match = id.match(/\d{4}-\d{2}-\d{2}/);
  if (match) return match[0]!;
  if (createdAt) return createdAt.slice(0, 10);
  return "0000-00-00";
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
