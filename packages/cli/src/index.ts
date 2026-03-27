#!/usr/bin/env node
import { Command } from "commander";
import { loginCommand } from "./commands/login.js";
import { projectCreateCommand, projectDeleteCommand, projectListCommand } from "./commands/projects.js";
import { docCreateCommand, docListCommand, docReadCommand, docEditCommand, docDeleteCommand, docPushCommand } from "./commands/documents.js";
import { initCommand } from "./commands/context.js";
import { aiSetupCommand, aiStatusCommand, aiRemoveCommand } from "./commands/ai.js";
import { aiFeatureCommand } from "./commands/feature.js";
import {
  memoryStateCommand,
  memoryStateUpdateCommand,
  memoryStateUpdateAiCommand,
  memoryDecisionAddCommand,
  memoryDecisionListCommand,
  memoryChangeLogCommand,
  memoryChangeListCommand,
  memoryRuleAddCommand,
  memoryRuleListCommand,
  timelineCommand,
} from "./commands/memory.js";
import { contextCommand, explainCommand } from "./commands/arch-context.js";
import { reviewCommand } from "./commands/review.js";

const program = new Command();

program
  .name("saedra")
  .description("Saedra CLI - Manage your projects from the terminal")
  .version("1.0.0");

program
  .command("login")
  .description("Log in to your Saedra account")
  .action(loginCommand);

program
  .command("init")
  .description("Link the current folder to a Saedra project")
  .option("--with-hooks", "Install git hooks for automatic change event tracking")
  .action((opts: { withHooks?: boolean }) => initCommand(opts));

program
  .command("whoami")
  .description("Show the logged-in user")
  .action(async () => {
    const config = await loadConfig();
    if (config?.email) {
      console.log(`Logged in as: ${config.email}`);
    } else {
      console.log("You are not logged in. Run: saedra login");
    }
  });

program
  .command("status")
  .description("Check API connection and login status")
  .action(async () => {
    const apiUrl = process.env.SAEDRA_API_URL ?? "https://saedra-api.onrender.com";

    console.log("\n  Saedra - Status\n");

    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = (await res.json()) as { version?: string; status?: string };
        console.log(`  API:    online (${data.version ?? data.status ?? "ok"})`);
        console.log(`  Server: ${apiUrl}`);
      } else {
        console.log(`  API:    error (HTTP ${res.status})`);
      }
    } catch {
      console.log("  API:    offline");
      console.log(`  Server: ${apiUrl}`);
    }

    const config = await loadConfig();
    if (config?.email) {
      console.log(`  User:   ${config.email}`);
    } else {
      console.log("  User:   not logged in");
    }
    console.log();
  });

program
  .command("logout")
  .description("Log out from current account")
  .action(async () => {
    const { clearConfig } = await import("./commands/login.js");
    await clearConfig();
    console.log("Logged out successfully.");
  });

const project = program
  .command("project")
  .description("Manage your projects");

project
  .command("create")
  .description("Create a new project")
  .action(projectCreateCommand);

project
  .command("list")
  .description("List all your projects")
  .action(projectListCommand);

project
  .command("delete")
  .description("Delete a project by ID")
  .action(projectDeleteCommand);

const doc = program
  .command("doc")
  .description("Manage documents within a project");

doc
  .command("create")
  .description("Create a new document in a project")
  .action(docCreateCommand);

doc
  .command("list")
  .description("List all documents in a project")
  .action(docListCommand);

doc
  .command("read [document]")
  .description("Read the content of a document")
  .action(docReadCommand);

doc
  .command("edit")
  .description("Update the content of a document")
  .action(docEditCommand);

doc
  .command("push [file]")
  .description("Push a local .md file to a project (create or update)")
  .action(docPushCommand);

doc
  .command("delete")
  .description("Delete a document from a project")
  .action(docDeleteCommand);

const ai = program
  .command("ai")
  .description("Configure AI provider for AI-powered commands");

ai.command("setup").description("Set up AI provider and API key").action(aiSetupCommand);
ai.command("status").description("Show current AI configuration").action(aiStatusCommand);
ai.command("remove").description("Remove AI configuration").action(aiRemoveCommand);
ai
  .command("feature [description]")
  .description("Generate architecture-aligned implementation guidance for a feature")
  .action((description?: string) => aiFeatureCommand(description));

program
  .command("context")
  .description("Print a compressed architecture context (ideal for AI prompts)")
  .option("--json", "Output as JSON")
  .option("--copy", "Copy output to clipboard instead of printing")
  .action((opts: { json?: boolean; copy?: boolean }) => contextCommand(opts));

program
  .command("explain")
  .description("Print a human-readable architecture overview (ideal for onboarding)")
  .action(explainCommand);

program
  .command("timeline")
  .description("Show a chronological timeline of architectural decisions and changes")
  .action(timelineCommand);

program
  .command("review")
  .description("Validate current diff against violation rules and architectural decisions")
  .option("--staged", "Analyze only staged files")
  .option("--json", "Output results as JSON (exits with code 1 if violations found)")
  .action((opts: { staged?: boolean; json?: boolean }) => reviewCommand(opts));

const memory = program
  .command("memory")
  .description("Manage architectural memory for this project");

const state = memory.command("state").description("Manage architecture state");
state.command("view").description("View current architecture state").action(memoryStateCommand);
state
  .command("update")
  .description("Update architecture state (interactive or AI-powered)")
  .option("--ai", "Generate state automatically using AI")
  .action((opts: { ai?: boolean }) =>
    opts.ai ? memoryStateUpdateAiCommand() : memoryStateUpdateCommand()
  );

const decision = memory.command("decision").description("Manage architectural decisions");
decision.command("add").description("Record a new architectural decision").action(memoryDecisionAddCommand);
decision.command("list").description("List all decisions").action(memoryDecisionListCommand);

const change = memory.command("change").description("Manage change events");
change
  .command("log")
  .description("Log a change event (manual or from git)")
  .option("--from-git", "Pre-fill from last git commit")
  .option("--no-prompt", "Skip interactive prompts and save automatically (requires --from-git)")
  .action((opts: { fromGit?: boolean; prompt: boolean }) =>
    memoryChangeLogCommand(opts.fromGit, !opts.prompt));
change.command("list").description("List recent change events").action(memoryChangeListCommand);

const rule = memory.command("rule").description("Manage architectural violation rules");
rule.command("add").description("Add a new violation rule").action(memoryRuleAddCommand);
rule.command("list").description("List all violation rules").action(memoryRuleListCommand);

program.parse();

async function loadConfig() {
  const { getConfig } = await import("./commands/login.js");
  return getConfig();
}
