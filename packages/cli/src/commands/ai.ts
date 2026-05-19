import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { confirm, password } from "@inquirer/prompts";

const CONFIG_DIR = join(process.env.HOME ?? process.env.USERPROFILE ?? "~", ".saedra");
const AI_CONFIG_FILE = join(CONFIG_DIR, "ai.json");

export interface AiConfig {
  apiKey: string;
}

export function getAiConfig(): AiConfig | null {
  const apiKey = process.env.SAEDRA_AI_API_KEY;
  if (apiKey) return { apiKey };
  if (!existsSync(AI_CONFIG_FILE)) return null;
  try {
    return JSON.parse(readFileSync(AI_CONFIG_FILE, "utf-8")) as AiConfig;
  } catch {
    return null;
  }
}

function saveAiConfig(config: AiConfig) {
  writeFileSync(AI_CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
}

function removeAiConfig() {
  if (existsSync(AI_CONFIG_FILE)) {
    rmSync(AI_CONFIG_FILE);
  }
}

export async function aiSetupCommand() {
  const existing = getAiConfig();
  if (existing) {
    console.log(`\n  AI already configured.`);
    const overwrite = await confirm({ message: "Overwrite?", default: false });
    if (!overwrite) {
      console.log("\nAborted.\n");
      return;
    }
  }

  console.log("\n  AI Setup\n");
  console.log("  Provider and model are configured per-project in the dashboard.\n");

  const apiKey = await password({ message: "API key (Anthropic or OpenAI):" });

  if (!apiKey.trim()) {
    console.error("\nAPI key cannot be empty.\n");
    process.exit(1);
  }

  saveAiConfig({ apiKey: apiKey.trim() });

  console.log(`\n  API key saved to: ${AI_CONFIG_FILE}\n`);
}

export async function aiStatusCommand() {
  const config = getAiConfig();

  console.log("\n  AI Configuration\n");

  if (!config) {
    console.log("  Not configured. Run: saedra ai setup\n");
    return;
  }

  const maskedKey = config.apiKey.slice(0, 8) + "..." + config.apiKey.slice(-4);

  console.log(`  API Key: ${maskedKey}`);
  console.log(`  Config:  ${AI_CONFIG_FILE}`);
  console.log(`\n  Provider and model are set per-project in the dashboard.\n`);
}

export async function aiRemoveCommand() {
  const config = getAiConfig();

  if (!config) {
    console.log("\n  No AI configuration found.\n");
    return;
  }

  const confirmed = await confirm({
    message: "Remove AI configuration?",
    default: false,
  });

  if (!confirmed) {
    console.log("\nAborted.\n");
    return;
  }

  removeAiConfig();
  console.log("\n  AI configuration removed.\n");
}
