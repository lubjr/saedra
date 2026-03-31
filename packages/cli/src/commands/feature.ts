import { input } from "@inquirer/prompts";
import { getConfig } from "./login.js";
import { getAiConfig } from "./ai.js";
import { streamAI } from "./ai-client.js";
import { selectProject } from "./helpers.js";
import { fetchState, fetchDecisions, fetchChanges } from "./arch-context.js";
import type { ArchitectureState, Decision, ChangeEvent } from "../memory/schemas.js";

function requireAuth() {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }
  return config;
}

function buildFeaturePrompt(
  projectName: string,
  description: string,
  state: ArchitectureState | null,
  decisions: Decision[],
  changes: ChangeEvent[]
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push(`Feature request: ${description}`);
  parts.push("");

  if (state) {
    parts.push("## Architecture State");
    parts.push(`Summary: ${state.summary}`);
    if (state.core_principles?.length) {
      parts.push(`Core Principles: ${state.core_principles.join(", ")}`);
    }
    if (state.critical_paths?.length) {
      parts.push("Critical Paths:");
      for (const p of state.critical_paths) parts.push(`  - ${p}`);
    }
    if (state.constraints?.length) {
      parts.push("Constraints:");
      for (const c of state.constraints) parts.push(`  - ${c}`);
    }
    parts.push("");
  }

  if (decisions.length) {
    parts.push("## Active Decisions");
    for (const d of decisions) {
      parts.push(`### ${d.id}: ${d.title}`);
      parts.push(`Context: ${d.context}`);
      parts.push(`Decision: ${d.decision}`);
      if (d.affects?.length) parts.push(`Affects: ${d.affects.join(", ")}`);
      if (d.constraints_introduced?.length) {
        parts.push(`Constraints introduced: ${d.constraints_introduced.join(", ")}`);
      }
      parts.push(`Risk: ${d.risk_level}`);
      parts.push("");
    }
  }

  if (changes.length) {
    parts.push("## Recent Changes (last 5)");
    for (const c of changes) {
      parts.push(`- ${c.id}: ${c.summary}`);
      if (c.architectural_impact) parts.push(`  Impact: ${c.architectural_impact}`);
    }
    parts.push("");
  }

  parts.push("## Task");
  parts.push(
    "Based on the architecture context above, provide a concrete implementation plan for the feature request. " +
    "Structure your response as:\n" +
    "1. A brief analysis of how this feature fits (or conflicts) with the current architecture\n" +
    "2. Step-by-step implementation plan referencing specific files/modules in the project\n" +
    "3. Active decisions and constraints that apply to this implementation\n" +
    "4. Any risks or architectural concerns to watch out for\n\n" +
    "Be specific and actionable. Reference actual modules, paths, and patterns from the architecture context."
  );

  return parts.join("\n");
}

export async function aiFeatureCommand(descriptionArg?: string) {
  const config = requireAuth();
  const project = await selectProject(config);

  const aiConfig = getAiConfig();
  if (!aiConfig) {
    console.error("\n  AI not configured. Run: saedra ai setup\n");
    process.exit(1);
  }

  let description = descriptionArg?.trim() ?? "";
  if (!description) {
    description = await input({ message: "Describe the feature you want to implement:" });
    if (!description.trim()) {
      console.error("Description cannot be empty.");
      process.exit(1);
    }
    description = description.trim();
  }

  console.log("\n  AI Feature — Context Injection\n");

  process.stdout.write("  Loading architecture state...   ");
  const [state, decisions, changes] = await Promise.all([
    fetchState(config.apiUrl, project.id, config.token),
    fetchDecisions(config.apiUrl, project.id, config.token),
    fetchChanges(config.apiUrl, project.id, config.token, 5),
  ]).catch((err) => {
    console.error("\n\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  });

  console.log("✓");
  console.log(`  Active decisions loaded:        ${decisions.length}`);
  console.log(`  Recent changes loaded:          ${changes.length}`);
  process.stdout.write("  Sending to AI...                \n\n");

  const separator = "  " + "─".repeat(50);
  console.log(separator);
  console.log(`  Suggestion for: ${description}\n`);

  try {
    const prompt = buildFeaturePrompt(project.name, description, state, decisions, changes);

    await streamAI(
      "You are an expert software architect advising on feature implementation. " +
        "Your suggestions must align strictly with the project's existing architecture, decisions, and constraints. " +
        "Be concrete, actionable, and reference actual modules and patterns from the provided context.",
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
