import type { Decision, ViolationRule, ArchitectureState, ChangeEvent } from "../memory/schemas.js";

export const MAX_DIFF_CHARS = 3000;

export const REVIEW_SYSTEM_PROMPT =
  "You are an architectural review tool. Analyze code diffs strictly against the provided violation rules and architectural decisions. " +
  "Respond only with valid JSON as instructed. Never add markdown or text outside the JSON object.\n\n" +
  "IMPORTANT: Only flag a violation when the diff contains clear, direct evidence of a rule breach. " +
  "Absence of evidence must produce \"status\": \"ok\" — never flag uncertainty as a violation.\n\n" +
  "Example — violation (controller imports db-connector directly, bypassing the abstraction layer):\n" +
  "{\"files\":[{\"file\":\"src/controllers/users.ts\",\"status\":\"violation\",\"violations\":[{\"rule_id\":\"RULE-no-direct-db\",\"detail\":\"Line 3: import { query } from '@repo/db-connector' — bypasses the db-queries abstraction\"}],\"note\":\"Controller accesses the database directly, violating the query abstraction rule\"}]}\n\n" +
  "Example — ok (all database access goes through db-queries as required):\n" +
  "{\"files\":[{\"file\":\"src/controllers/teams.ts\",\"status\":\"ok\",\"violations\":[],\"note\":\"All database calls delegated to @repo/db-queries — no rule breaches detected\"}]}";

export const FEATURE_SYSTEM_PROMPT =
  "You are an expert software architect advising on feature implementation. " +
  "Your suggestions must align strictly with the project's existing architecture, decisions, and constraints. " +
  "Be concrete, actionable, and reference actual modules and patterns from the provided context.";

export const COMPRESS_SYSTEM_PROMPT =
  "You are an expert software architect. Compress architectural context into a structured JSON object. " +
  "Return ONLY valid JSON matching the ArchitectureState schema — no markdown, no explanation, just the JSON object.";

export const ANALYZE_SYSTEM_PROMPT =
  "You are an expert software architect analyzing the architectural impact of a change event. " +
  "Be concrete and direct. Reference specific decisions, rules, and modules from the provided context. " +
  "Keep the analysis focused and actionable.";

export function buildReviewPrompt(
  projectName: string,
  files: Array<{ file: string; diff: string }>,
  rules: ViolationRule[],
  decisions: Decision[],
  state: ArchitectureState | null = null
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push("");

  if (state && (state.critical_paths?.length || state.constraints?.length)) {
    parts.push("## Architecture State");
    if (state.critical_paths?.length) {
      parts.push("Critical Paths:");
      for (const p of state.critical_paths) parts.push(`  - ${p}`);
    }
    if (state.constraints?.length) {
      parts.push("Constraints:");
      for (const c of state.constraints) parts.push(`  - ${c}`);
    }
    parts.push("");
  }

  if (rules.length) {
    parts.push("## Violation Rules");
    for (const r of rules) {
      parts.push(`- ${r.id} [${r.severity.toUpperCase()}]: ${r.description}`);
      if (r.related_decision) {
        const dec = decisions.find((d) => d.id === r.related_decision);
        if (dec) {
          const constraints = dec.constraints_introduced?.length
            ? ` — constraints: [${dec.constraints_introduced.join("; ")}]`
            : "";
          parts.push(`  Related decision: "${dec.title}"${constraints}`);
        } else {
          parts.push(`  Related decision: ${r.related_decision}`);
        }
      }
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
      const wasTruncated = diff.length > MAX_DIFF_CHARS;
      parts.push("```diff");
      parts.push(wasTruncated ? diff.slice(0, MAX_DIFF_CHARS) + "\n[... diff truncated at 3000 chars ...]" : diff);
      parts.push("```");
    } else {
      parts.push("(diff not available)");
    }
    parts.push("");
  }

  parts.push("## Task");
  parts.push(
    "Analyze each changed file against the violation rules and architectural decisions above.\n" +
    "Use status \"violation\" for clear rule breaches, \"warning\" for potential issues that lack direct evidence, and \"ok\" for compliant files.\n" +
    "Respond ONLY with valid JSON — no markdown, no explanation outside the JSON:\n" +
    '{\n' +
    '  "files": [\n' +
    '    {\n' +
    '      "file": "path/to/file.ts",\n' +
    '      "status": "violation" | "warning" | "ok",\n' +
    '      "violations": [{ "rule_id": "RULE-XXX", "detail": "specific reason" }],\n' +
    '      "note": "one line explanation"\n' +
    '    }\n' +
    '  ]\n' +
    '}'
  );

  return parts.join("\n");
}

export function buildFeaturePrompt(
  projectName: string,
  description: string,
  state: ArchitectureState | null,
  decisions: Decision[],
  changes: ChangeEvent[]
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push(`Feature request: ${description}`);
  parts.push("");

  if (state) {
    parts.push("## Architecture State");
    parts.push(`Summary: ${state.summary}`);
    if (state.core_principles?.length) {
      parts.push(`Core Principles: ${state.core_principles.join(", ")}`);
    }
    if (state.critical_paths?.length) {
      parts.push("Critical Paths:");
      for (const p of state.critical_paths) parts.push(`  - ${p}`);
    }
    if (state.constraints?.length) {
      parts.push("Constraints:");
      for (const c of state.constraints) parts.push(`  - ${c}`);
    }
    parts.push("");
  }

  if (decisions.length) {
    parts.push("## Active Decisions");
    for (const d of decisions) {
      parts.push(`### ${d.id}: ${d.title}`);
      parts.push(`Context: ${d.context}`);
      parts.push(`Decision: ${d.decision}`);
      if (d.affects?.length) parts.push(`Affects: ${d.affects.join(", ")}`);
      if (d.constraints_introduced?.length) {
        parts.push(`Constraints introduced: ${d.constraints_introduced.join(", ")}`);
      }
      parts.push(`Risk: ${d.risk_level}`);
      parts.push("");
    }
  }

  if (changes.length) {
    parts.push("## Recent Changes (last 5)");
    for (const c of changes) {
      parts.push(`- ${c.id}: ${c.summary}`);
      if (c.architectural_impact) parts.push(`  Impact: ${c.architectural_impact}`);
    }
    parts.push("");
  }

  parts.push("## Task");
  parts.push(
    "Based on the architecture context above, provide a concrete implementation plan for the feature request. " +
    "Structure your response as:\n" +
    "1. A brief analysis of how this feature fits (or conflicts) with the current architecture\n" +
    "2. Step-by-step implementation plan referencing specific files/modules in the project\n" +
    "3. Active decisions and constraints that apply to this implementation\n" +
    "4. Any risks or architectural concerns to watch out for\n\n" +
    "Be specific and actionable. Reference actual modules, paths, and patterns from the architecture context."
  );

  return parts.join("\n");
}

export function buildCompressPrompt(
  projectName: string,
  decisions: Decision[],
  changes: ChangeEvent[],
  current: ArchitectureState | null
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push("");

  if (current) {
    parts.push("## Current Architecture State");
    parts.push(JSON.stringify(current, null, 2));
    parts.push("");
  }

  if (decisions.length) {
    parts.push("## Active Decisions");
    for (const d of decisions) {
      parts.push(`### ${d.id}: ${d.title}`);
      parts.push(`Context: ${d.context}`);
      parts.push(`Decision: ${d.decision}`);
      parts.push(`Affects: ${d.affects.join(", ")}`);
      parts.push(`Risk: ${d.risk_level}`);
      parts.push("");
    }
  }

  if (changes.length) {
    parts.push("## Recent Changes (last 10)");
    for (const c of changes) {
      parts.push(`### ${c.id}: ${c.summary}`);
      if (c.architectural_impact) parts.push(`Impact: ${c.architectural_impact}`);
      if (c.files_changed?.length) parts.push(`Files: ${c.files_changed.join(", ")}`);
      parts.push("");
    }
  }

  parts.push("## Task");
  parts.push(
    "Based on the above, generate a compressed ArchitectureState JSON object with exactly these fields:\n" +
    "- version: string (YYYY-MM-DD)\n" +
    "- summary: string (1-3 sentences capturing the essence of the current architecture)\n" +
    "- core_principles: string[] (3-6 key engineering principles in use)\n" +
    "- critical_paths: string[] (3-5 most important data/request flows)\n" +
    "- constraints: string[] (hard constraints: Node version, package manager, required env vars, etc.)\n" +
    `- active_decisions: string[] (IDs of active decisions exactly as listed above)`
  );

  return parts.join("\n");
}

export function buildAnalyzePrompt(
  projectName: string,
  change: ChangeEvent,
  state: ArchitectureState | null,
  decisions: Decision[],
  rules: ViolationRule[]
): string {
  const parts: string[] = [];

  parts.push(`Project: ${projectName}`);
  parts.push("");
  parts.push("## Change Event to Analyze");
  parts.push(`ID: ${change.id}`);
  parts.push(`Summary: ${change.summary}`);
  if (change.files_changed?.length) {
    parts.push(`Files changed: ${change.files_changed.join(", ")}`);
  }
  if (change.architectural_impact) {
    parts.push(`Recorded impact: ${change.architectural_impact}`);
  }
  if (change.risk_assessment) {
    parts.push(`Recorded risk: ${change.risk_assessment}`);
  }
  if (change.related_decisions?.length) {
    parts.push(`Related decisions (as recorded): ${change.related_decisions.join(", ")}`);
  }
  parts.push("");

  if (state) {
    parts.push("## Current Architecture State");
    parts.push(`Summary: ${state.summary}`);
    if (state.core_principles?.length) {
      parts.push(`Core Principles: ${state.core_principles.join("; ")}`);
    }
    if (state.constraints?.length) {
      parts.push(`Constraints: ${state.constraints.join("; ")}`);
    }
    parts.push("");
  }

  if (decisions.length) {
    parts.push("## Active Architectural Decisions");
    for (const d of decisions) {
      parts.push(`- ${d.id}: ${d.title}`);
      parts.push(`  Decision: ${d.decision}`);
      if (d.affects?.length) parts.push(`  Affects: ${d.affects.join(", ")}`);
      if (d.constraints_introduced?.length) {
        parts.push(`  Constraints: ${d.constraints_introduced.join(", ")}`);
      }
    }
    parts.push("");
  }

  if (rules.length) {
    parts.push("## Violation Rules");
    for (const r of rules) {
      parts.push(`- ${r.id} [${r.severity.toUpperCase()}]: ${r.description}`);
      if (r.related_decision) parts.push(`  Related to: ${r.related_decision}`);
    }
    parts.push("");
  }

  parts.push("## Task");
  parts.push(
    "Analyze the architectural impact of this change event. Structure your response as:\n" +
    "1. **Impact Summary** — what this change implies architecturally in 2-3 sentences\n" +
    "2. **Affected Decisions** — which active decisions are touched or reinforced by this change\n" +
    "3. **Rule Compliance** — whether this change respects or potentially violates any violation rules\n" +
    "4. **Risk Assessment** — low / medium / high with brief justification\n" +
    "5. **Overlooked Concerns** — anything the recorded impact or risk assessment missed (if applicable)"
  );

  return parts.join("\n");
}
