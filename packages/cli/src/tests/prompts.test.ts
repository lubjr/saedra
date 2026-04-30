import { describe, test, expect } from "vitest";
import { buildReviewPrompt, buildFeaturePrompt, buildCompressPrompt, MAX_DIFF_CHARS } from "../commands/prompts.js";
import { DIFF_VIOLATION } from "./fixtures/diff-violation.js";
import { DIFF_OK } from "./fixtures/diff-ok.js";
import type { Decision, ViolationRule, ArchitectureState, ChangeEvent } from "../memory/schemas.js";

const MOCK_RULE: ViolationRule = {
  id: "RULE-2026-01-01-no-direct-db",
  description: "No direct DB access — use @repo/db-queries",
  severity: "high",
  related_decision: "DEC-2026-01-01-db-abstraction",
  created_at: "2026-01-01T00:00:00Z",
};

const MOCK_DECISION: Decision = {
  id: "DEC-2026-01-01-db-abstraction",
  title: "All DB access via db-queries abstraction",
  status: "active",
  context: "Direct DB access created tight coupling",
  decision: "Route all queries through @repo/db-queries",
  impact: [],
  affects: ["src/controllers"],
  constraints_introduced: ["No direct imports from @repo/db-connector"],
  supersedes: null,
  risk_level: "low",
  created_at: "2026-01-01T00:00:00Z",
};

const MOCK_STATE: ArchitectureState = {
  version: "2026-01-01",
  summary: "REST API with layered architecture",
  core_principles: ["separation of concerns", "single responsibility"],
  critical_paths: ["API → controller → service → db-queries → database"],
  constraints: ["Node 20+", "pnpm only"],
  active_decisions: ["DEC-2026-01-01-db-abstraction"],
};

const MOCK_CHANGE: ChangeEvent = {
  id: "CHG-2026-01-02-add-teams",
  summary: "Added teams endpoint",
  files_changed: ["src/controllers/teams.ts"],
  architectural_impact: "New controller follows db-queries pattern",
  risk_assessment: "low",
  related_decisions: ["DEC-2026-01-01-db-abstraction"],
  created_at: "2026-01-02T00:00:00Z",
};

describe("buildReviewPrompt", () => {
  test("includes project name", () => {
    const prompt = buildReviewPrompt("MyProject", [], [], []);
    expect(prompt).toContain("Project: MyProject");
  });

  test("includes violation rule id and description", () => {
    const prompt = buildReviewPrompt("P", [], [MOCK_RULE], []);
    expect(prompt).toContain("RULE-2026-01-01-no-direct-db");
    expect(prompt).toContain("No direct DB access — use @repo/db-queries");
    expect(prompt).toContain("[HIGH]");
  });

  test("expands related_decision with title and constraints when decision is present", () => {
    const prompt = buildReviewPrompt("P", [], [MOCK_RULE], [MOCK_DECISION]);
    expect(prompt).toContain('"All DB access via db-queries abstraction"');
    expect(prompt).toContain("No direct imports from @repo/db-connector");
  });

  test("falls back to decision id when decision not found", () => {
    const rule = { ...MOCK_RULE, related_decision: "DEC-MISSING" };
    const prompt = buildReviewPrompt("P", [], [rule], []);
    expect(prompt).toContain("Related decision: DEC-MISSING");
  });

  test("includes architecture state critical_paths and constraints", () => {
    const prompt = buildReviewPrompt("P", [], [], [], MOCK_STATE);
    expect(prompt).toContain("## Architecture State");
    expect(prompt).toContain("API → controller → service → db-queries → database");
    expect(prompt).toContain("Node 20+");
  });

  test("omits architecture state section when state is null", () => {
    const prompt = buildReviewPrompt("P", [], [], [], null);
    expect(prompt).not.toContain("## Architecture State");
  });

  test("omits architecture state section when state has no critical_paths or constraints", () => {
    const emptyState: ArchitectureState = { ...MOCK_STATE, critical_paths: [], constraints: [] };
    const prompt = buildReviewPrompt("P", [], [], [], emptyState);
    expect(prompt).not.toContain("## Architecture State");
  });

  test("includes diff for violation fixture", () => {
    const files = [{ file: "src/controllers/users.ts", diff: DIFF_VIOLATION }];
    const prompt = buildReviewPrompt("P", files, [], []);
    expect(prompt).toContain("### src/controllers/users.ts");
    expect(prompt).toContain("@repo/db-connector");
  });

  test("includes diff for ok fixture", () => {
    const files = [{ file: "src/controllers/teams.ts", diff: DIFF_OK }];
    const prompt = buildReviewPrompt("P", files, [], []);
    expect(prompt).toContain("### src/controllers/teams.ts");
    expect(prompt).toContain("@repo/db-queries");
  });

  test("truncates diff and appends truncation comment when diff exceeds MAX_DIFF_CHARS", () => {
    const tail = "SHOULD_NOT_APPEAR";
    const longDiff = "+" + "x".repeat(MAX_DIFF_CHARS) + tail;
    const files = [{ file: "src/big.ts", diff: longDiff }];
    const prompt = buildReviewPrompt("P", files, [], []);
    expect(prompt).toContain("[... diff truncated at 3000 chars ...]");
    expect(prompt).not.toContain(tail);
  });

  test("includes task section with status options", () => {
    const prompt = buildReviewPrompt("P", [], [], []);
    expect(prompt).toContain("## Task");
    expect(prompt).toContain('"violation"');
    expect(prompt).toContain('"warning"');
    expect(prompt).toContain('"ok"');
  });
});

describe("buildFeaturePrompt", () => {
  test("includes project name and feature description", () => {
    const prompt = buildFeaturePrompt("MyProject", "Add team invites", null, [], []);
    expect(prompt).toContain("Project: MyProject");
    expect(prompt).toContain("Feature request: Add team invites");
  });

  test("includes architecture state when provided", () => {
    const prompt = buildFeaturePrompt("P", "feat", MOCK_STATE, [], []);
    expect(prompt).toContain("## Architecture State");
    expect(prompt).toContain("REST API with layered architecture");
    expect(prompt).toContain("separation of concerns");
  });

  test("includes decisions with constraints", () => {
    const prompt = buildFeaturePrompt("P", "feat", null, [MOCK_DECISION], []);
    expect(prompt).toContain("## Active Decisions");
    expect(prompt).toContain("DEC-2026-01-01-db-abstraction");
    expect(prompt).toContain("No direct imports from @repo/db-connector");
  });

  test("includes recent changes", () => {
    const prompt = buildFeaturePrompt("P", "feat", null, [], [MOCK_CHANGE]);
    expect(prompt).toContain("## Recent Changes");
    expect(prompt).toContain("Added teams endpoint");
  });

  test("omits sections when empty", () => {
    const prompt = buildFeaturePrompt("P", "feat", null, [], []);
    expect(prompt).not.toContain("## Architecture State");
    expect(prompt).not.toContain("## Active Decisions");
    expect(prompt).not.toContain("## Recent Changes");
  });

  test("includes task section", () => {
    const prompt = buildFeaturePrompt("P", "feat", null, [], []);
    expect(prompt).toContain("## Task");
    expect(prompt).toContain("implementation plan");
  });
});

describe("buildCompressPrompt", () => {
  test("includes project name", () => {
    const prompt = buildCompressPrompt("MyProject", [], [], null);
    expect(prompt).toContain("Project: MyProject");
  });

  test("includes current state as JSON when provided", () => {
    const prompt = buildCompressPrompt("P", [], [], MOCK_STATE);
    expect(prompt).toContain("## Current Architecture State");
    expect(prompt).toContain('"REST API with layered architecture"');
  });

  test("includes decisions", () => {
    const prompt = buildCompressPrompt("P", [MOCK_DECISION], [], null);
    expect(prompt).toContain("## Active Decisions");
    expect(prompt).toContain("DEC-2026-01-01-db-abstraction");
    expect(prompt).toContain("All DB access via db-queries abstraction");
  });

  test("includes recent changes", () => {
    const prompt = buildCompressPrompt("P", [], [MOCK_CHANGE], null);
    expect(prompt).toContain("## Recent Changes");
    expect(prompt).toContain("Added teams endpoint");
    expect(prompt).toContain("New controller follows db-queries pattern");
  });

  test("includes task with expected output fields", () => {
    const prompt = buildCompressPrompt("P", [], [], null);
    expect(prompt).toContain("## Task");
    expect(prompt).toContain("version:");
    expect(prompt).toContain("summary:");
    expect(prompt).toContain("core_principles:");
    expect(prompt).toContain("critical_paths:");
    expect(prompt).toContain("constraints:");
    expect(prompt).toContain("active_decisions:");
  });

  test("omits sections when empty", () => {
    const prompt = buildCompressPrompt("P", [], [], null);
    expect(prompt).not.toContain("## Current Architecture State");
    expect(prompt).not.toContain("## Active Decisions");
    expect(prompt).not.toContain("## Recent Changes");
  });
});
