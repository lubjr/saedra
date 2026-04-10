import { describe, test, expect, vi, beforeEach } from "vitest";
import * as loginModule from "../commands/login.js";
import * as helpersModule from "../commands/helpers.js";
import * as archContextModule from "../commands/arch-context.js";
import * as aiClientModule from "../commands/ai-client.js";
import * as childProcess from "child_process";

vi.mock("../commands/login.js", () => ({
  getConfig: vi.fn(),
}));

vi.mock("../commands/helpers.js", () => ({
  selectProject: vi.fn(),
}));

vi.mock("../commands/arch-context.js", () => ({
  fetchDecisions: vi.fn(),
  fetchRules: vi.fn(),
}));

vi.mock("../commands/ai-client.js", () => ({
  callAI: vi.fn(),
}));

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("../commands/ai.js", () => ({
  getAiConfig: vi.fn(),
}));

const mockGetConfig = vi.mocked(loginModule.getConfig);
const mockSelectProject = vi.mocked(helpersModule.selectProject);
const mockFetchDecisions = vi.mocked(archContextModule.fetchDecisions);
const mockFetchRules = vi.mocked(archContextModule.fetchRules);
const mockCallAI = vi.mocked(aiClientModule.callAI);
const mockExecSync = vi.mocked(childProcess.execSync);

import * as aiModule from "../commands/ai.js";
const mockGetAiConfig = vi.mocked(aiModule.getAiConfig);

const { reviewCommand } = await import("../commands/review.js");

const MOCK_CONFIG = {
  email: "user@example.com",
  userId: "user-123",
  token: "tok_xyz",
  apiUrl: "https://api.example.com",
};

const MOCK_PROJECT = { id: "proj-1", name: "Test Project" };

const MOCK_AI_CONFIG = { provider: "claude" as const, apiKey: "sk-ant-test" };

const MOCK_RULES = [
  {
    id: "RULE-2026-01-01-no-direct-db",
    description: "No direct DB access from UI",
    severity: "high" as const,
    related_decision: "DEC-2026-01-01-auth",
    created_at: "2026-01-01T00:00:00Z",
  },
];

const MOCK_DECISIONS = [
  {
    id: "DEC-2026-01-01-auth",
    title: "Auth via Supabase",
    status: "active" as const,
    context: "We needed auth",
    decision: "Use Supabase Auth",
    impact: [],
    affects: [],
    constraints_introduced: ["No custom JWT"],
    supersedes: null,
    risk_level: "low" as const,
    created_at: "2026-01-01T00:00:00Z",
  },
];

const MOCK_REVIEW_RESULT_OK = JSON.stringify({
  files: [{ file: "src/index.ts", status: "ok", violations: [], note: "Looks good" }],
});

const MOCK_REVIEW_RESULT_VIOLATION = JSON.stringify({
  files: [
    {
      file: "src/index.ts",
      status: "violation",
      violations: [{ rule_id: "RULE-2026-01-01-no-direct-db", detail: "Direct DB call found" }],
      note: "Violates DB access rule",
    },
  ],
});

describe("review", () => {
  const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("process.exit");
  });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(process.stdout, "write").mockImplementation(() => true);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("reviewCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(reviewCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when AI is not configured", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(null);

      await expect(reviewCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("prints no changed files message when working tree is clean", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockExecSync.mockReturnValue("" as any);

      await expect(reviewCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(0);
    });

    test("outputs JSON when json option is true and working tree is clean", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockExecSync.mockReturnValue("" as any);

      await expect(reviewCommand({ json: true })).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(0);
    });

    test("reports no violations when all files are ok", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockExecSync
        .mockReturnValueOnce("src/index.ts\n" as any)
        .mockReturnValueOnce("diff --git a/src/index.ts..." as any);
      mockFetchRules.mockResolvedValue(MOCK_RULES);
      mockFetchDecisions.mockResolvedValue(MOCK_DECISIONS);
      mockCallAI.mockResolvedValue(MOCK_REVIEW_RESULT_OK);

      await reviewCommand();

      expect(mockExit).not.toHaveBeenCalled();
    });

    test("exits with 1 when violations are found and json option is true", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockExecSync
        .mockReturnValueOnce("src/index.ts\n" as any)
        .mockReturnValueOnce("diff --git a/src/index.ts..." as any);
      mockFetchRules.mockResolvedValue(MOCK_RULES);
      mockFetchDecisions.mockResolvedValue(MOCK_DECISIONS);
      mockCallAI.mockResolvedValue(MOCK_REVIEW_RESULT_VIOLATION);

      await expect(reviewCommand({ json: true })).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("reviews staged files when staged option is true", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockExecSync
        .mockReturnValueOnce("src/feature.ts\n" as any)
        .mockReturnValueOnce("diff --staged..." as any);
      mockFetchRules.mockResolvedValue([]);
      mockFetchDecisions.mockResolvedValue([]);
      mockCallAI.mockResolvedValue(MOCK_REVIEW_RESULT_OK);

      await reviewCommand({ staged: true });

      expect(mockExecSync).toHaveBeenCalledWith(
        "git diff --staged --name-only",
        expect.any(Object)
      );
    });
  });
});
