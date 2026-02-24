import { existsSync, readFileSync } from "node:fs";
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

function readFileContent(filePath: string): string {
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  return readFileSync(filePath, "utf-8");
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const body = JSON.parse(text) as { error?: string };
    return body.error ?? `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

export async function docCreateCommand() {
  const config = requireAuth();

  const projectId = await input({ message: "Project ID:" });
  if (!projectId.trim()) {
    console.error("Project ID cannot be empty.");
    process.exit(1);
  }

  const name = await input({ message: "Document name (e.g. README.md):" });
  if (!name.trim()) {
    console.error("Document name cannot be empty.");
    process.exit(1);
  }

  const filePath = await input({ message: "File path (leave empty for blank content):" });

  const content = filePath.trim() ? readFileContent(filePath.trim()) : "";

  try {
    const res = await fetch(`${config.apiUrl}/projects/${projectId}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.token}`,
      },
      body: JSON.stringify({ name, content }),
    });

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to create document: ${error}`);
      process.exit(1);
    }

    const document = (await res.json()) as { data?: { id: string; name: string } };
    const data = document.data ?? (document as any);

    console.log(`\nDocument created successfully!`);
    console.log(`  Name: ${data.name}`);
    console.log(`  ID:   ${data.id}\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function docListCommand() {
  const config = requireAuth();

  const projectId = await input({ message: "Project ID:" });
  if (!projectId.trim()) {
    console.error("Project ID cannot be empty.");
    process.exit(1);
  }

  try {
    const res = await fetch(`${config.apiUrl}/projects/${projectId}/documents`, {
      headers: { "Authorization": `Bearer ${config.token}` },
    });

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to list documents: ${error}`);
      process.exit(1);
    }

    const documents = (await res.json()) as Array<{
      id: string;
      name: string;
      created_at: string;
      updated_at: string;
    }>;

    if (!documents.length) {
      console.log("\nNo documents found. Create one with: saedra doc create\n");
      return;
    }

    console.log("\n  Documents:\n");
    for (const doc of documents) {
      const created = new Date(doc.created_at).toLocaleDateString();
      const updated = new Date(doc.updated_at).toLocaleDateString();
      console.log(`  - ${doc.name}`);
      console.log(`      ID:      ${doc.id}`);
      console.log(`      Created: ${created}`);
      console.log(`      Updated: ${updated}`);
    }
    console.log();
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function docReadCommand() {
  const config = requireAuth();

  const projectId = await input({ message: "Project ID:" });
  if (!projectId.trim()) {
    console.error("Project ID cannot be empty.");
    process.exit(1);
  }

  const documentId = await input({ message: "Document ID:" });
  if (!documentId.trim()) {
    console.error("Document ID cannot be empty.");
    process.exit(1);
  }

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${projectId}/documents/${documentId}`,
      { headers: { "Authorization": `Bearer ${config.token}` } }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to read document: ${error}`);
      process.exit(1);
    }

    const document = (await res.json()) as {
      id: string;
      name: string;
      content: string;
      created_at: string;
      updated_at: string;
    };

    const doc = (document as any).data ?? document;

    console.log(`\n  ${doc.name}\n`);
    console.log(doc.content);
    console.log();
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function docEditCommand() {
  const config = requireAuth();

  const projectId = await input({ message: "Project ID:" });
  if (!projectId.trim()) {
    console.error("Project ID cannot be empty.");
    process.exit(1);
  }

  const documentId = await input({ message: "Document ID:" });
  if (!documentId.trim()) {
    console.error("Document ID cannot be empty.");
    process.exit(1);
  }

  const filePath = await input({ message: "File path with new content:" });
  if (!filePath.trim()) {
    console.error("File path cannot be empty.");
    process.exit(1);
  }

  const content = readFileContent(filePath.trim());

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${projectId}/documents/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.token}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to update document: ${error}`);
      process.exit(1);
    }

    console.log(`\nDocument updated successfully.\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}

export async function docDeleteCommand() {
  const config = requireAuth();

  const projectId = await input({ message: "Project ID:" });
  if (!projectId.trim()) {
    console.error("Project ID cannot be empty.");
    process.exit(1);
  }

  const documentId = await input({ message: "Document ID to delete:" });
  if (!documentId.trim()) {
    console.error("Document ID cannot be empty.");
    process.exit(1);
  }

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${projectId}/documents/${documentId}`,
      {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${config.token}` },
      }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to delete document: ${error}`);
      process.exit(1);
    }

    console.log(`\nDocument deleted successfully.\n`);
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }
}
