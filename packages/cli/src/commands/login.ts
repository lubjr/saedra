import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isAllowedApiUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:") return true;
    return parsed.protocol === "http:" && LOCAL_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

function requireAllowedApiUrl(apiUrl: string) {
  if (!isAllowedApiUrl(apiUrl)) {
    console.error(
      `\nRefusing to use SAEDRA_API_URL="${apiUrl}": only https:// or http://localhost are allowed (avoids sending your token in the clear to an arbitrary host).`
    );
    process.exit(1);
  }
}

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function saveConfig(config: SaedraConfig) {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
}

export function getConfig(): SaedraConfig | null {
  const token = process.env.SAEDRA_TOKEN;
  const apiUrl = process.env.SAEDRA_API_URL;
  if (token && apiUrl) {
    requireAllowedApiUrl(apiUrl);
    return { token, apiUrl, userId: process.env.SAEDRA_USER_ID ?? "", email: "" };
  }
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    const parsed = JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as SaedraConfig;
    try {
      chmodSync(CONFIG_FILE, 0o600);
    } catch {}
    return parsed;
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
  requireAllowedApiUrl(apiUrl);

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
