import { describe, test, expect, vi, beforeEach } from "vitest";
import * as loginModule from "../commands/login.js";
import * as helpersModule from "../commands/helpers.js";
import * as childProcess from "node:child_process";
import * as prompts from "@inquirer/prompts";

vi.mock("../commands/login.js", () => ({
  getConfig: vi.fn(),
}));

vi.mock("../commands/helpers.js", () => ({
  selectProject: vi.fn(),
}));

vi.mock("../commands/ai.js", () => ({
  getAiConfig: vi.fn(),
}));

vi.mock("../commands/ai-client.js", () => ({
  streamAI: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  execSync: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
  select: vi.fn(),
  confirm: vi.fn(),
}));

const mockGetConfig = vi.mocked(loginModule.getConfig);
const mockSelectProject = vi.mocked(helpersModule.selectProject);
const mockExecSync = vi.mocked(childProcess.execSync);
const mockConfirm = vi.mocked(prompts.confirm);

import * as aiModule from "../commands/ai.js";
import * as aiClientModule from "../commands/ai-client.js";
const mockGetAiConfig = vi.mocked(aiModule.getAiConfig);
const mockStreamAI = vi.mocked(aiClientModule.streamAI);

const {
  memoryStateCommand,
  memoryChangeLogCommand,
  memoryChangeListCommand,
  memoryRuleListCommand,
} = await import("../commands/memory.js");

const MOCK_CONFIG = {
  email: "user@example.com",
  userId: "user-123",
  token: "tok_xyz",
  apiUrl: "https://api.example.com",
};

const MOCK_PROJECT = { id: "proj-1", name: "Test Project" };

const MOCK_STATE = {
  version: "2026-01-01",
  summary: "Monorepo with Supabase and AWS Bedrock",
  core_principles: ["SOLID"],
  critical_paths: [],
  constraints: [],
  active_decisions: [],
};

const MOCK_CHANGE = {
  id: "CHG-2026-01-10-add-login",
  summary: "Add login flow",
  related_decisions: [],
  files_changed: ["apps/web/app/login/page.tsx"],
  architectural_impact: "New auth entry point",
  risk_assessment: "Low",
  created_at: "2026-01-10T00:00:00Z",
};

const MOCK_RULE = {
  id: "RULE-2026-01-01-no-direct-db",
  description: "No direct DB access from UI",
  severity: "high",
  related_decision: null,
  created_at: "2026-01-01T00:00:00Z",
};

describe("memory", () => {
  const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("process.exit");
  });
  const mockFetch = vi.fn();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = mockFetch as typeof globalThis.fetch;
  });

  describe("memoryStateCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(memoryStateCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("prints no state message when no architecture docs found", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      await memoryStateCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("saedra memory state update")
      );
    });

    test("exits with 1 when fetch fails", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({
        ok: false,
        text: async () => JSON.stringify({ error: "unauthorized" }),
        status: 401,
      });

      await expect(memoryStateCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("displays architecture state when docs are found", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: "doc-state-1", name: "architecture-state.json" }],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { content: JSON.stringify(MOCK_STATE) } }),
          text: async () => "{}",
          status: 200,
        });

      await memoryStateCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(MOCK_STATE.summary)
      );
    });

    test("exits with 1 when architecture state content is malformed JSON", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: "doc-state-1", name: "architecture-state.json" }],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ content: "not-valid-json{{{" }),
          text: async () => "{}",
          status: 200,
        });

      await expect(memoryStateCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("memoryChangeLogCommand (no-prompt git mode)", () => {
    test("exits with 1 when noPrompt is true but fromGit is false", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);

      await expect(memoryChangeLogCommand(false, true)).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when git commands fail", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockExecSync.mockImplementation(() => {
        throw new Error("not a git repo");
      });

      await expect(memoryChangeLogCommand(true, true)).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("saves change event automatically from git commit", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockExecSync
        .mockReturnValueOnce("feat: add login flow\n" as any)
        .mockReturnValueOnce("apps/web/app/login/page.tsx\n" as any);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
        text: async () => "{}",
        status: 201,
      });

      await memoryChangeLogCommand(true, true);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/documents"),
        expect.objectContaining({ method: "POST" })
      );
    });

    test("exits with 1 when API fails to save change event", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockExecSync
        .mockReturnValueOnce("feat: add login\n" as any)
        .mockReturnValueOnce("src/index.ts\n" as any);
      mockFetch.mockResolvedValue({
        ok: false,
        text: async () => JSON.stringify({ error: "server error" }),
        status: 500,
      });

      await expect(memoryChangeLogCommand(true, true)).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("memoryChangeListCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(memoryChangeListCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("prints no changes message when list is empty", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      await memoryChangeListCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("saedra memory change log")
      );
    });

    test("lists change events when docs are found", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ id: "doc-1", content: JSON.stringify(MOCK_CHANGE) }],
      });

      await memoryChangeListCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(MOCK_CHANGE.id)
      );
    });

    test("exits with 1 when fetch fails", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({
        ok: false,
        text: async () => JSON.stringify({ error: "unauthorized" }),
        status: 401,
      });

      await expect(memoryChangeListCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("memoryRuleListCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(memoryRuleListCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("prints no rules message when list is empty", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      await memoryRuleListCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("saedra memory rule add")
      );
    });

    test("lists rules when docs are found", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ id: "doc-1", content: JSON.stringify(MOCK_RULE) }],
      });

      await memoryRuleListCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(MOCK_RULE.id)
      );
    });

    test("exits with 1 when fetch fails", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({
        ok: false,
        text: async () => JSON.stringify({ error: "unauthorized" }),
        status: 401,
      });

      await expect(memoryRuleListCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
