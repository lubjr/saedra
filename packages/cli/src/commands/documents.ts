import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import { input, select, confirm } from "@inquirer/prompts";
import { getConfig } from "./login.js";
import { selectProject, selectDocument } from "./helpers.js";

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

  const project = await selectProject(config);

  const name = await input({ message: "Document name (e.g. README.md):" });
  if (!name.trim()) {
    console.error("Document name cannot be empty.");
    process.exit(1);
  }

  const filePath = await input({ message: "File path (leave empty for blank content):" });

  const content = filePath.trim() ? readFileContent(filePath.trim()) : "";

  try {
    const res = await fetch(`${config.apiUrl}/projects/${project.id}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
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

  const project = await selectProject(config);

  try {
    const res = await fetch(`${config.apiUrl}/projects/${project.id}/documents`, {
      headers: { Authorization: `Bearer ${config.token}` },
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

    console.log(`\n  Documents in ${project.name}:\n`);
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

  const project = await selectProject(config);
  const document = await selectDocument(config, project.id);

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents/${document.id}`,
      { headers: { Authorization: `Bearer ${config.token}` } }
    );

    if (!res.ok) {
      const error = await parseError(res);
      console.error(`\nFailed to read document: ${error}`);
      process.exit(1);
    }

    const result = (await res.json()) as {
      id: string;
      name: string;
      content: string;
      created_at: string;
      updated_at: string;
    };

    const doc = (result as any).data ?? result;

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

  const project = await selectProject(config);
  const document = await selectDocument(config, project.id);

  const filePath = await input({ message: "File path with new content:" });
  if (!filePath.trim()) {
    console.error("File path cannot be empty.");
    process.exit(1);
  }

  const content = readFileContent(filePath.trim());

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents/${document.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token}`,
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

export async function docPushCommand(filePath?: string) {
  const config = requireAuth();

  let resolvedPath: string;

  if (!filePath) {
    const mdFiles = readdirSync(process.cwd()).filter((f) => f.endsWith(".md"));
    if (!mdFiles.length) {
      console.error("No .md files found in the current directory.");
      process.exit(1);
    }
    resolvedPath = await select({
      message: "Select a file to push:",
      choices: mdFiles.map((f) => ({ name: f, value: f })),
    });
  } else {
    resolvedPath = filePath;
  }

  const content = readFileContent(resolvedPath);
  const name = basename(resolvedPath);

  const project = await selectProject(config);

  let existingDocId: string | null = null;

  try {
    const res = await fetch(`${config.apiUrl}/projects/${project.id}/documents`, {
      headers: { Authorization: `Bearer ${config.token}` },
    });

    if (res.ok) {
      const documents = (await res.json()) as Array<{ id: string; name: string }>;
      const existing = documents.find((d) => d.name === name);
      if (existing) existingDocId = existing.id;
    }
  } catch (err) {
    console.error("\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  }

  if (existingDocId) {
    const confirmed = await confirm({
      message: `Document "${name}" already exists in ${project.name}. Update it?`,
      default: true,
    });

    if (!confirmed) {
      console.log("\nAborted.\n");
      return;
    }

    try {
      const res = await fetch(
        `${config.apiUrl}/projects/${project.id}/documents/${existingDocId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) {
        const error = await parseError(res);
        console.error(`\nFailed to update document: ${error}`);
        process.exit(1);
      }

      console.log(`\nDocument "${name}" updated successfully.\n`);
    } catch (err) {
      console.error("\nFailed to connect to server:", (err as Error).message);
      process.exit(1);
    }
  } else {
    try {
      const res = await fetch(`${config.apiUrl}/projects/${project.id}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.token}`,
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
}

export async function docDeleteCommand() {
  const config = requireAuth();

  const project = await selectProject(config);
  const document = await selectDocument(config, project.id);

  try {
    const res = await fetch(
      `${config.apiUrl}/projects/${project.id}/documents/${document.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${config.token}` },
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
