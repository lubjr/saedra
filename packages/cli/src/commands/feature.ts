import { input } from "@inquirer/prompts";
import { getAiConfig } from "./ai.js";
import { streamAI } from "./ai-client.js";
import { selectProject, requireAuth } from "./helpers.js";
import { fetchState, fetchDecisions, fetchChanges } from "./arch-context.js";
import { buildFeaturePrompt, FEATURE_SYSTEM_PROMPT } from "./prompts.js";

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

    await streamAI(FEATURE_SYSTEM_PROMPT, prompt, aiConfig, (text) => process.stdout.write(text));

    process.stdout.write("\n");
    console.log(separator);
    console.log();
  } catch (err) {
    console.error("\n  Failed:", (err as Error).message, "\n");
    process.exit(1);
  }
}
