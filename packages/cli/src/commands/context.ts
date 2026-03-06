import { existsSync, readFileSync, writeFileSync, mkdirSync, chmodSync } from "node:fs";
import { join, resolve } from "node:path";
import { getConfig } from "./login.js";
import { selectProject } from "./helpers.js";

const CONTEXT_FILE = ".saedra";

export interface SaedraContext {
  projectId: string;
  projectName: string;
}

export function findSaedraContext(): SaedraContext | null {
  let dir = process.cwd();

  while (true) {
    const filePath = join(dir, CONTEXT_FILE);
    if (existsSync(filePath)) {
      try {
        return JSON.parse(readFileSync(filePath, "utf-8")) as SaedraContext;
      } catch {
        return null;
      }
    }

    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

export async function initCommand(opts: { withHooks?: boolean } = {}) {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }

  const project = await selectProject(config);

  const context: SaedraContext = {
    projectId: project.id,
    projectName: project.name,
  };

  writeFileSync(CONTEXT_FILE, JSON.stringify(context, null, 2) + "\n");

  console.log(`\nLinked to project ${project.name}. Created ${CONTEXT_FILE}`);

  if (opts.withHooks) {
    installGitHooks();
  }

  console.log();
}

function installGitHooks() {
  const hooksDir = ".saedra-hooks";
  const hookContent = "#!/bin/sh\nsaedra memory change log --from-git --no-prompt\n";

  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir);
  }

  const hookFile = join(hooksDir, "post-commit");
  writeFileSync(hookFile, hookContent);
  chmodSync(hookFile, 0o755);
  console.log(`  Created: .saedra-hooks/post-commit`);

  const gitHooksDir = join(".git", "hooks");
  if (existsSync(gitHooksDir)) {
    const gitHookFile = join(gitHooksDir, "post-commit");
    if (existsSync(gitHookFile)) {
      console.log(
        `  Warning: .git/hooks/post-commit already exists — skipped. To activate manually:`
      );
      console.log(
        `    cp .saedra-hooks/post-commit .git/hooks/post-commit`
      );
    } else {
      writeFileSync(gitHookFile, hookContent);
      chmodSync(gitHookFile, 0o755);
      console.log(`  Installed: .git/hooks/post-commit`);
      console.log(
        `  Every commit will now log a change event automatically.`
      );
    }
  } else {
    console.log(
      `  No .git/hooks/ found. To activate the hook manually:`
    );
    console.log(
      `    cp .saedra-hooks/post-commit .git/hooks/post-commit`
    );
  }

  console.log(
    `  Tip: commit .saedra-hooks/ so teammates can install with: cp .saedra-hooks/post-commit .git/hooks/post-commit`
  );
}
