import { input } from "@inquirer/prompts";
import { getConfig } from "./login.js";

function requireAuth() {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }
  return config;
}

export async function projectCreateCommand() {
  const config = requireAuth();

  const name = await input({ message: "Project name:" });

  if (!name.trim()) {
    console.error("Project name cannot be empty.");
    process.exit(1);
  }

  try {
    const res = await fetch(`${config.apiUrl}/projects/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.token}`,
      },
      body: JSON.stringify({ name, userId: config.userId }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      console.error(`\nFailed to create project: ${body.error ?? "unknown error"}`);
      process.exit(1);
    }

    const project = (await res.json()) as { data?: { id: string; name: string } };
    const data = project.data ?? (project as any);

    console.log(`\nProject created successfully!`);
    console.log(`  Name: ${data.name}`);
    console.log(`  ID:   ${data.id}\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function projectListCommand() {
  const config = requireAuth();

  try {
    const res = await fetch(`${config.apiUrl}/projects/user/${config.userId}`, {
      headers: { "Authorization": `Bearer ${config.token}` },
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      console.error(`\nFailed to list projects: ${body.error ?? "unknown error"}`);
      process.exit(1);
    }

    const projects = (await res.json()) as Array<{ id: string; name: string; created_at: string }>;

    if (!projects.length) {
      console.log("\nNo projects found. Create one with: saedra project create\n");
      return;
    }

    console.log("\n  Your projects:\n");
    for (const p of projects) {
      const date = new Date(p.created_at).toLocaleDateString();
      console.log(`  - ${p.name}`);
      console.log(`      ID:      ${p.id}`);
      console.log(`      Created: ${date}`);
    }
    console.log();
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function projectDeleteCommand() {
  const config = requireAuth();

  const projectId = await input({ message: "Project ID to delete:" });

  if (!projectId.trim()) {
    console.error("Project ID cannot be empty.");
    process.exit(1);
  }

  try {
    const res = await fetch(`${config.apiUrl}/projects/${projectId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${config.token}` },
    });

    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      console.error(`\nFailed to delete project: ${body.error ?? "unknown error"}`);
      process.exit(1);
    }

    console.log(`\nProject deleted successfully.\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}
