import { execSync } from "child_process";
import ora from "ora";
import { getAiConfig } from "./ai.js";
import { callAI } from "./ai-client.js";
import { selectProject, requireAuth } from "./helpers.js";
import { fetchDecisions, fetchRules } from "./arch-context.js";
import { buildReviewPrompt, REVIEW_SYSTEM_PROMPT, MAX_DIFF_CHARS } from "./prompts.js";

const MAX_FILES = 20;

function getChangedFiles(staged: boolean, base?: string): string[] {
  try {
    let cmd: string;
    if (base) {
      cmd = `git diff --name-only ${base}...HEAD`;
    } else if (staged) {
      cmd = "git diff --staged --name-only";
    } else {
      cmd = "git diff HEAD --name-only";
    }
    const output = execSync(cmd, { encoding: "utf-8" }).trim();
    if (!output) return [];
    return output.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function getFileDiff(file: string, staged: boolean, base?: string): string {
  try {
    let cmd: string;
    if (base) {
      cmd = `git diff ${base}...HEAD -- "${file}"`;
    } else if (staged) {
      cmd = `git diff --staged -- "${file}"`;
    } else {
      cmd = `git diff HEAD -- "${file}"`;
    }
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}


interface FileResult {
  file: string;
  status: "violation" | "ok";
  violations: Array<{ rule_id: string; detail: string }>;
  note: string;
}

interface ReviewResult {
  files: FileResult[];
}

export async function reviewCommand(opts: { staged?: boolean; json?: boolean; base?: string } = {}) {
  const config = requireAuth();
  const project = await selectProject(config);

  const aiConfig = getAiConfig();
  if (!aiConfig) {
    console.error("\n  AI not configured. Run: saedra ai setup\n");
    process.exit(1);
  }

  const allChangedFiles = getChangedFiles(opts.staged ?? false, opts.base);

  if (!allChangedFiles.length) {
    const scope = opts.staged ? "staging area" : "working tree";
    if (opts.json) {
      console.log(JSON.stringify({ project: project.name, total_violations: 0, files: [] }, null, 2));
    } else {
      console.log(`\n  No changed files found in ${scope}.\n`);
    }
    process.exit(0);
  }

  const changedFiles = allChangedFiles.slice(0, MAX_FILES);
  const truncated = allChangedFiles.length > MAX_FILES;

  if (!opts.json) {
    console.log("\n  Architectural Review\n");
  }

  const fileLabel = `${changedFiles.length} file${changedFiles.length > 1 ? "s" : ""}${truncated ? ` (of ${allChangedFiles.length})` : ""}`;
  const contextSpinner = opts.json ? null : ora(`Fetching context for ${fileLabel}...`).start();

  const [rules, decisions] = await Promise.all([
    fetchRules(config.apiUrl, project.id, config.token),
    fetchDecisions(config.apiUrl, project.id, config.token),
  ]).catch((err) => {
    contextSpinner?.fail("Failed to connect to server");
    console.error("\n\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  });

  contextSpinner?.succeed(`Loaded ${rules.length} rule${rules.length !== 1 ? "s" : ""} and ${decisions.length} decision${decisions.length !== 1 ? "s" : ""}`);

  const filesWithDiffs = changedFiles.map((file) => ({
    file,
    diff: getFileDiff(file, opts.staged ?? false, opts.base),
  }));

  const truncatedCount = filesWithDiffs.filter((f) => f.diff.length > MAX_DIFF_CHARS).length;

  const aiSpinner = opts.json ? null : ora("Reviewing with AI...").start();

  try {
    const prompt = buildReviewPrompt(project.name, filesWithDiffs, rules, decisions);

    const rawText = await callAI(REVIEW_SYSTEM_PROMPT, prompt, aiConfig);

    let result: ReviewResult;
    try {
      const cleaned = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      result = JSON.parse(cleaned) as ReviewResult;
    } catch {
      aiSpinner?.fail("Failed to parse AI response. Try again.");
      process.exit(1);
    }

    aiSpinner?.succeed("Review complete");

    const totalViolations = result.files.filter((f) => f.status === "violation").length;

    if (opts.json) {
      console.log(JSON.stringify({
        project: project.name,
        total_violations: totalViolations,
        files: result.files,
      }, null, 2));
      process.exit(totalViolations > 0 ? 1 : 0);
    }

    const separator = "  " + "─".repeat(50);
    console.log(separator);

    if (truncatedCount > 0) {
      console.log(`\n  ⚠  Note: ${truncatedCount} file${truncatedCount > 1 ? "s were" : " was"} truncated (diff > 3000 chars). Results may be incomplete.`);
    }

    for (const fileResult of result.files) {
      if (fileResult.status === "violation") {
        console.log(`\n  ⚠  VIOLATION  ${fileResult.file}`);
        if (fileResult.note) console.log(`     ${fileResult.note}`);
        for (const v of fileResult.violations) {
          const rule = rules.find((r) => r.id === v.rule_id);
          console.log(`     Violates: ${v.rule_id}${rule ? ` — ${rule.description}` : ""}`);
          console.log(`     Detail:   ${v.detail}`);
          if (rule?.related_decision) {
            console.log(`     Decision: ${rule.related_decision}`);
          }
        }
      } else {
        console.log(`\n  ✓  OK  ${fileResult.file}`);
        if (fileResult.note) console.log(`     ${fileResult.note}`);
      }
    }

    console.log(`\n${separator}`);

    if (totalViolations > 0) {
      console.log(`\n  Result: ${totalViolations} violation${totalViolations > 1 ? "s" : ""} — review before opening PR\n`);
    } else {
      console.log("\n  Result: no violations found\n");
    }
  } catch (err) {
    aiSpinner?.fail((err as Error).message);
    process.exit(1);
  }
}
