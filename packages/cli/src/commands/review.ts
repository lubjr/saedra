import { execSync } from "child_process";
import { getConfig } from "./login.js";
import { getAiConfig } from "./ai.js";
import { selectProject } from "./helpers.js";
import { fetchDecisions, fetchRules } from "./arch-context.js";
import type { Decision, ViolationRule } from "../memory/schemas.js";

const MAX_FILES = 20;
const MAX_DIFF_CHARS = 3000;

function requireAuth() {
  const config = getConfig();
  if (!config) {
    console.error("You are not logged in. Run: saedra login");
    process.exit(1);
  }
  return config;
}

function getChangedFiles(staged: boolean): string[] {
  try {
    const cmd = staged ? "git diff --staged --name-only" : "git diff HEAD --name-only";
    const output = execSync(cmd, { encoding: "utf-8" }).trim();
    if (!output) return [];
    return output.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function getFileDiff(file: string, staged: boolean): string {
  try {
    const cmd = staged ? `git diff --staged -- "${file}"` : `git diff HEAD -- "${file}"`;
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function buildReviewPrompt(
  projectName: string,
  files: Array<{ file: string; diff: string }>,
  rules: ViolationRule[],
  decisions: Decision[]
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push("");

  if (rules.length) {
    parts.push("## Violation Rules");
    for (const r of rules) {
      parts.push(`- ${r.id} [${r.severity.toUpperCase()}]: ${r.description}`);
      if (r.related_decision) parts.push(`  Related decision: ${r.related_decision}`);
    }
    parts.push("");
  }

  if (decisions.length) {
    parts.push("## Active Decisions");
    for (const d of decisions) {
      parts.push(`- ${d.id}: ${d.title}`);
      if (d.constraints_introduced?.length) {
        parts.push(`  Constraints: ${d.constraints_introduced.join("; ")}`);
      }
    }
    parts.push("");
  }

  parts.push("## Changed Files");
  for (const { file, diff } of files) {
    parts.push(`### ${file}`);
    if (diff) {
      parts.push("```diff");
      parts.push(diff.slice(0, MAX_DIFF_CHARS));
      parts.push("```");
    } else {
      parts.push("(diff not available)");
    }
    parts.push("");
  }

  parts.push("## Task");
  parts.push(
    "Analyze each changed file against the violation rules and architectural decisions above.\n" +
    "Respond ONLY with valid JSON — no markdown, no explanation outside the JSON:\n" +
    '{\n' +
    '  "files": [\n' +
    '    {\n' +
    '      "file": "path/to/file.ts",\n' +
    '      "status": "violation" or "ok",\n' +
    '      "violations": [{ "rule_id": "RULE-XXX", "detail": "specific reason" }],\n' +
    '      "note": "one line explanation"\n' +
    '    }\n' +
    '  ]\n' +
    '}'
  );

  return parts.join("\n");
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

export async function reviewCommand(opts: { staged?: boolean; json?: boolean } = {}) {
  const config = requireAuth();
  const project = await selectProject(config);

  const aiConfig = getAiConfig();
  if (!aiConfig) {
    console.error("\n  AI not configured. Run: saedra ai setup\n");
    process.exit(1);
  }

  if (aiConfig.provider !== "claude") {
    console.error("\n  Only Claude is supported for this command. Run: saedra ai setup\n");
    process.exit(1);
  }

  const allChangedFiles = getChangedFiles(opts.staged ?? false);

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
    process.stdout.write(`  Analyzing ${changedFiles.length} changed file${changedFiles.length > 1 ? "s" : ""}${truncated ? ` (of ${allChangedFiles.length} — limit ${MAX_FILES})` : ""}...   `);
  }

  const [rules, decisions] = await Promise.all([
    fetchRules(config.apiUrl, project.id, config.token),
    fetchDecisions(config.apiUrl, project.id, config.token),
  ]).catch((err) => {
    console.error("\n\nFailed to connect to server:", (err as Error).message);
    process.exit(1);
  });

  if (!opts.json) {
    console.log("✓");
    console.log(`  Loaded ${rules.length} violation rule${rules.length !== 1 ? "s" : ""} and ${decisions.length} active decision${decisions.length !== 1 ? "s" : ""}.`);
    process.stdout.write("  Sending to Claude...            \n\n");
  }

  const filesWithDiffs = changedFiles.map((file) => ({
    file,
    diff: getFileDiff(file, opts.staged ?? false),
  }));

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const anthropic = new Anthropic({ apiKey: aiConfig.apiKey });

    const prompt = buildReviewPrompt(project.name, filesWithDiffs, rules, decisions);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system:
        "You are an architectural review tool. Analyze code diffs strictly against the provided violation rules and architectural decisions. " +
        "Respond only with valid JSON as instructed. Never add markdown or text outside the JSON object.",
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    let result: ReviewResult;
    try {
      const cleaned = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      result = JSON.parse(cleaned) as ReviewResult;
    } catch {
      console.error("\n  Failed to parse AI response. Try again.\n");
      process.exit(1);
    }

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
    console.error("\n  Failed:", (err as Error).message, "\n");
    process.exit(1);
  }
}
