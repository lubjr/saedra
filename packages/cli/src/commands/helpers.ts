import { select } from "@inquirer/prompts";
import type { SaedraConfig } from "./login.js";

export async function selectProject(config: SaedraConfig): Promise<{ id: string; name: string }> {
  const res = await fetch(`${config.apiUrl}/projects/user/${config.userId}`, {
    headers: { Authorization: `Bearer ${config.token}` },
  });

  if (!res.ok) {
    console.error("\nFailed to fetch projects.");
    process.exit(1);
  }

  const projects = (await res.json()) as Array<{ id: string; name: string }>;

  if (!projects.length) {
    console.error("\nNo projects found. Create one with: saedra project create");
    process.exit(1);
  }

  const id = await select({
    message: "Select a project:",
    choices: projects.map((p) => ({ name: p.name, value: p.id })),
  });

  const name = projects.find((p) => p.id === id)!.name;
  return { id, name };
}

export async function selectDocument(
  config: SaedraConfig,
  projectId: string
): Promise<{ id: string; name: string }> {
  const res = await fetch(`${config.apiUrl}/projects/${projectId}/documents`, {
    headers: { Authorization: `Bearer ${config.token}` },
  });

  if (!res.ok) {
    console.error("\nFailed to fetch documents.");
    process.exit(1);
  }

  const documents = (await res.json()) as Array<{ id: string; name: string }>;

  if (!documents.length) {
    console.error("\nNo documents found. Create one with: saedra doc create");
    process.exit(1);
  }

  const id = await select({
    message: "Select a document:",
    choices: documents.map((d) => ({ name: d.name, value: d.id })),
  });

  const name = documents.find((d) => d.id === id)!.name;
  return { id, name };
}
