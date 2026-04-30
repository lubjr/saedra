import { execSync } from "child_process";
import ora from "ora";
import { getAiConfig } from "./ai.js";
import { callAI } from "./ai-client.js";
import { selectProject, requireAuth, loadLocalContext, isContextFresh } from "./helpers.js";
import { fetchDecisions, fetchRules, fetchState } from "./arch-context.js";
import type { Decision, ViolationRule, ArchitectureState } from "../memory/schemas.js";
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
  status: "violation" | "warning" | "ok";
  violations: Array<{ rule_id: string; detail: string }>;
  note: string;
}

interface ReviewResult {
  files: FileResult[];
}

export async function reviewCommand(opts: { staged?: boolean; json?: boolean; base?: string; offline?: boolean } = {}) {
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
  const spinnerMsg = opts.offline
    ? `Loading local snapshot for ${fileLabel}...`
    : `Fetching context for ${fileLabel}...`;
  const contextSpinner = opts.json ? null : ora(spinnerMsg).start();

  let state: ArchitectureState | null;
  let rules: ViolationRule[];
  let decisions: Decision[];

  if (opts.offline) {
    const localCtx = loadLocalContext();
    if (!localCtx) {
      contextSpinner?.fail("No local snapshot found");
      console.error("\n  No .saedra-context.json found. Run: saedra memory compress\n");
      process.exit(1);
    }
    state = localCtx.state;
    rules = localCtx.rules;
    decisions = localCtx.decisions;
    contextSpinner?.succeed("Loaded from local snapshot");
    console.error(`\n  ⚠  Using local snapshot (generated_at: ${localCtx.generated_at})`);
    if (!isContextFresh(localCtx)) {
      console.error(`     ⚠  Snapshot is older than 60 minutes. Results may be outdated.`);
    }
  } else {
    try {
      [state, rules, decisions] = await Promise.all([
        fetchState(config.apiUrl, project.id, config.token),
        fetchRules(config.apiUrl, project.id, config.token),
        fetchDecisions(config.apiUrl, project.id, config.token),
      ]);
      contextSpinner?.succeed(`Loaded ${rules.length} rule${rules.length !== 1 ? "s" : ""} and ${decisions.length} decision${decisions.length !== 1 ? "s" : ""}${state ? " + architecture state" : ""}`);
    } catch (err) {
      const localCtx = loadLocalContext();
      if (!localCtx) {
        contextSpinner?.fail("Failed to connect to server");
        console.error(`\n\nFailed to connect to server: ${(err as Error).message}`);
        process.exit(1);
      }
      contextSpinner?.warn("Server unreachable — using local snapshot");
      console.error(`\n  ⚠  Server unreachable — using local snapshot (generated_at: ${localCtx.generated_at})`);
      if (!isContextFresh(localCtx)) {
        console.error(`     ⚠  Snapshot is older than 60 minutes. Results may be outdated.`);
      }
      state = localCtx.state;
      rules = localCtx.rules;
      decisions = localCtx.decisions;
    }
  }

  const filesWithDiffs = changedFiles.map((file) => ({
    file,
    diff: getFileDiff(file, opts.staged ?? false, opts.base),
  }));

  const truncatedCount = filesWithDiffs.filter((f) => f.diff.length > MAX_DIFF_CHARS).length;

  const aiSpinner = opts.json ? null : ora("Reviewing with AI...").start();

  try {
    const prompt = buildReviewPrompt(project.name, filesWithDiffs, rules, decisions, state);

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

    const violations = result.files.filter((f) => f.status === "violation");
    const warnings = result.files.filter((f) => f.status === "warning");
    const okFiles = result.files.filter((f) => f.status === "ok");

    const summary = {
      violations: violations.length,
      warnings: warnings.length,
      ok: okFiles.length,
    };

    if (opts.json) {
      console.log(JSON.stringify({
        project: project.name,
        total_violations: violations.length,
        summary,
        files: result.files,
      }, null, 2));
      process.exit(violations.length > 0 ? 1 : 0);
    }

    const separator = "  " + "─".repeat(50);
    console.log(separator);

    if (truncatedCount > 0) {
      console.log(`\n  ⚠  Note: ${truncatedCount} file${truncatedCount > 1 ? "s were" : " was"} truncated (diff > 3000 chars). Results may be incomplete.`);
    }

    const ordered = [...violations, ...warnings, ...okFiles];
    for (const fileResult of ordered) {
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
      } else if (fileResult.status === "warning") {
        console.log(`\n  ⚡  WARNING  ${fileResult.file}`);
        if (fileResult.note) console.log(`     ${fileResult.note}`);
        for (const v of fileResult.violations) {
          const rule = rules.find((r) => r.id === v.rule_id);
          console.log(`     Relates to: ${v.rule_id}${rule ? ` — ${rule.description}` : ""}`);
          console.log(`     Detail:     ${v.detail}`);
          if (rule?.related_decision) {
            console.log(`     Decision:   ${rule.related_decision}`);
          }
        }
      } else {
        console.log(`\n  ✓  OK  ${fileResult.file}`);
        if (fileResult.note) console.log(`     ${fileResult.note}`);
      }
    }

    console.log(`\n${separator}`);

    const parts: string[] = [];
    if (summary.violations > 0) parts.push(`${summary.violations} violation${summary.violations > 1 ? "s" : ""}`);
    if (summary.warnings > 0) parts.push(`${summary.warnings} warning${summary.warnings > 1 ? "s" : ""}`);
    if (summary.ok > 0) parts.push(`${summary.ok} ok`);

    if (summary.violations > 0) {
      console.log(`\n  Result: ${parts.join(", ")} — review before opening PR\n`);
    } else if (summary.warnings > 0) {
      console.log(`\n  Result: ${parts.join(", ")} — no blocking violations\n`);
    } else {
      console.log("\n  Result: no violations found\n");
    }
  } catch (err) {
    aiSpinner?.fail((err as Error).message);
    process.exit(1);
  }
}
