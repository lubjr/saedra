import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { input, password } from "@inquirer/prompts";

const CONFIG_DIR = join(homedir(), ".saedra");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface SaedraConfig {
  email: string;
  userId: string;
  token: string;
  apiUrl: string;
}

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function saveConfig(config: SaedraConfig) {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getConfig(): SaedraConfig | null {
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as SaedraConfig;
  } catch {
    return null;
  }
}

export function clearConfig() {
  if (existsSync(CONFIG_FILE)) {
    rmSync(CONFIG_FILE);
  }
}

export async function loginCommand() {
  const existing = getConfig();
  if (existing?.email) {
    console.log(`Already logged in as: ${existing.email}`);
    console.log("Run 'saedra logout' first.\n");
    return;
  }

  console.log("\n  Saedra - Login\n");

  const apiUrl = process.env.SAEDRA_API_URL ?? "https://saedra-api.onrender.com";

  const email = await input({ message: "Email:" });
  const pwd = await password({ message: "Password:" });

  try {
    const res = await fetch(`${apiUrl}/projects/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pwd }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      console.error(`\nLogin failed: ${body.error ?? "invalid credentials"}`);
      process.exit(1);
    }

    const { session } = (await res.json()) as {
      session: {
        userId: {
          access_token: string;
          user: { id: string };
        };
      };
    };

    saveConfig({
      email,
      userId: session.userId.user.id,
      token: session.userId.access_token,
      apiUrl,
    });

    console.log(`\nLogin successful! Welcome, ${email}`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    console.error(`Make sure the API is running at: ${apiUrl}`);
    process.exit(1);
  }
}
