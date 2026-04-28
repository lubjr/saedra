import { input } from "@inquirer/prompts";
import ora from "ora";
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

  const contextSpinner = ora("Loading architecture state...").start();
  const [state, decisions, changes] = await Promise.all([
    fetchState(config.apiUrl, project.id, config.token),
    fetchDecisions(config.apiUrl, project.id, config.token),
    fetchChanges(config.apiUrl, project.id, config.token, 5),
  ]).catch((err) => {
    contextSpinner.fail("Failed to connect to server");
    console.error("\n\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  });

  contextSpinner.succeed(`Loaded ${decisions.length} decision${decisions.length !== 1 ? "s" : ""} and ${changes.length} change${changes.length !== 1 ? "s" : ""}`);

  const separator = "  " + "─".repeat(50);
  const aiSpinner = ora("Generating suggestion...").start();
  let headerPrinted = false;

  try {
    const prompt = buildFeaturePrompt(project.name, description, state, decisions, changes);

    await streamAI(
      FEATURE_SYSTEM_PROMPT,
      prompt,
      aiConfig,
      (text) => {
        if (!headerPrinted) {
          aiSpinner.stop();
          console.log(separator);
          console.log(`  Suggestion for: ${description}\n`);
          headerPrinted = true;
        }
        process.stdout.write(text);
      }
    );

    if (!headerPrinted) aiSpinner.stop();
    process.stdout.write("\n");
    console.log(separator);
    console.log();
  } catch (err) {
    aiSpinner.fail((err as Error).message);
    process.exit(1);
  }
}
