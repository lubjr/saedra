#!/usr/bin/env node
import { Command } from "commander";
import { loginCommand } from "./commands/login.js";

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

program.parse();

async function loadConfig() {
  const { getConfig } = await import("./commands/login.js");
  return getConfig();
}
