import { describe, test, expect, vi, beforeEach } from "vitest";
import * as loginModule from "../commands/login.js";
import * as helpersModule from "../commands/helpers.js";
import * as aiModule from "../commands/ai.js";
import * as aiClientModule from "../commands/ai-client.js";
import * as archContextModule from "../commands/arch-context.js";
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

vi.mock("../commands/arch-context.js", () => ({
  fetchState: vi.fn(),
  fetchDecisions: vi.fn(),
  fetchChanges: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
}));

const mockGetConfig = vi.mocked(loginModule.getConfig);
const mockSelectProject = vi.mocked(helpersModule.selectProject);
const mockGetAiConfig = vi.mocked(aiModule.getAiConfig);
const mockStreamAI = vi.mocked(aiClientModule.streamAI);
const mockFetchState = vi.mocked(archContextModule.fetchState);
const mockFetchDecisions = vi.mocked(archContextModule.fetchDecisions);
const mockFetchChanges = vi.mocked(archContextModule.fetchChanges);
const mockInput = vi.mocked(prompts.input);

const { aiFeatureCommand } = await import("../commands/feature.js");

const MOCK_CONFIG = {
  email: "user@example.com",
  userId: "user-123",
  token: "tok_xyz",
  apiUrl: "https://api.example.com",
};

const MOCK_PROJECT = { id: "proj-1", name: "Test Project" };

const MOCK_AI_CONFIG = { provider: "claude" as const, apiKey: "sk-ant-test" };

const MOCK_STATE = {
  version: "2026-01-01",
  summary: "Monorepo architecture",
  core_principles: ["SOLID"],
  critical_paths: [],
  constraints: [],
  active_decisions: [],
};

const MOCK_DECISIONS = [
  {
    id: "DEC-2026-01-01-auth",
    title: "Auth via Supabase",
    status: "active" as const,
    context: "We needed auth",
    decision: "Use Supabase",
    impact: [],
    affects: [],
    constraints_introduced: [],
    supersedes: null,
    risk_level: "low" as const,
    created_at: "2026-01-01T00:00:00Z",
  },
];

describe("feature", () => {
  const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("process.exit");
  });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(process.stdout, "write").mockImplementation(() => true);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("aiFeatureCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(aiFeatureCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when AI is not configured", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(null);

      await expect(aiFeatureCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when description is empty after prompt", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockInput.mockResolvedValue("   ");

      await expect(aiFeatureCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("uses description argument directly when provided, skipping prompt", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockFetchState.mockResolvedValue(MOCK_STATE);
      mockFetchDecisions.mockResolvedValue(MOCK_DECISIONS);
      mockFetchChanges.mockResolvedValue([]);
      mockStreamAI.mockResolvedValue(undefined);

      await aiFeatureCommand("Add user dashboard");

      expect(mockInput).not.toHaveBeenCalled();
      expect(mockStreamAI).toHaveBeenCalledOnce();
    });

    test("prompts for description when no argument is provided", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockInput.mockResolvedValue("Add user dashboard");
      mockFetchState.mockResolvedValue(null);
      mockFetchDecisions.mockResolvedValue([]);
      mockFetchChanges.mockResolvedValue([]);
      mockStreamAI.mockResolvedValue(undefined);

      await aiFeatureCommand();

      expect(mockInput).toHaveBeenCalledOnce();
      expect(mockStreamAI).toHaveBeenCalledOnce();
    });

    test("loads architecture context and passes it to AI", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockFetchState.mockResolvedValue(MOCK_STATE);
      mockFetchDecisions.mockResolvedValue(MOCK_DECISIONS);
      mockFetchChanges.mockResolvedValue([]);
      mockStreamAI.mockResolvedValue(undefined);

      await aiFeatureCommand("Add search feature");

      expect(mockFetchState).toHaveBeenCalledWith(
        MOCK_CONFIG.apiUrl,
        MOCK_PROJECT.id,
        MOCK_CONFIG.token
      );
      expect(mockFetchDecisions).toHaveBeenCalledWith(
        MOCK_CONFIG.apiUrl,
        MOCK_PROJECT.id,
        MOCK_CONFIG.token
      );
      expect(mockFetchChanges).toHaveBeenCalledWith(
        MOCK_CONFIG.apiUrl,
        MOCK_PROJECT.id,
        MOCK_CONFIG.token,
        5
      );
    });

    test("passes architecture context to AI prompt", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockGetAiConfig.mockReturnValue(MOCK_AI_CONFIG);
      mockFetchState.mockResolvedValue(MOCK_STATE);
      mockFetchDecisions.mockResolvedValue(MOCK_DECISIONS);
      mockFetchChanges.mockResolvedValue([]);
      mockStreamAI.mockResolvedValue(undefined);

      await aiFeatureCommand("Add search feature");

      const [, userPrompt] = mockStreamAI.mock.calls[0]!;
      expect(userPrompt).toContain("Add search feature");
      expect(userPrompt).toContain(MOCK_STATE.summary);
      expect(userPrompt).toContain(MOCK_DECISIONS[0]!.title);
    });
  });
});
