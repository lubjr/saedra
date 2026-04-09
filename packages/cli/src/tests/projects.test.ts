import { describe, test, expect, vi, beforeEach } from "vitest";
import * as loginModule from "../commands/login.js";
import * as helpersModule from "../commands/helpers.js";
import * as prompts from "@inquirer/prompts";

vi.mock("../commands/login.js", () => ({
  getConfig: vi.fn(),
}));

vi.mock("../commands/helpers.js", () => ({
  selectProject: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
}));

const mockGetConfig = vi.mocked(loginModule.getConfig);
const mockSelectProject = vi.mocked(helpersModule.selectProject);
const mockInput = vi.mocked(prompts.input);

const { projectCreateCommand, projectListCommand, projectDeleteCommand } =
  await import("../commands/projects.js");

const MOCK_CONFIG = {
  email: "user@example.com",
  userId: "user-123",
  token: "tok_xyz",
  apiUrl: "https://api.example.com",
};

const MOCK_PROJECTS = [
  { id: "proj-1", name: "Project Alpha", created_at: "2024-01-15T00:00:00Z" },
  { id: "proj-2", name: "Project Beta", created_at: "2024-02-20T00:00:00Z" },
];

const MOCK_PROJECT_CREATED = { id: "proj-new", name: "New Project" };

describe("projects", () => {
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

  describe("projectListCommand", () => {
    test.each([
      {
        scenario: "lists projects when authenticated and API succeeds",
        configValue: MOCK_CONFIG,
        fetchResponse: { ok: true, json: async () => MOCK_PROJECTS },
        expectsExit: false,
      },
      {
        scenario: "prints no projects message when list is empty",
        configValue: MOCK_CONFIG,
        fetchResponse: { ok: true, json: async () => [] },
        expectsExit: false,
      },
      {
        scenario: "exits with 1 when API returns error",
        configValue: MOCK_CONFIG,
        fetchResponse: { ok: false, json: async () => ({ error: "unauthorized" }) },
        expectsExit: true,
      },
    ])("$scenario", async ({ configValue, fetchResponse, expectsExit }) => {
      mockGetConfig.mockReturnValue(configValue);
      mockFetch.mockResolvedValue(fetchResponse);

      if (expectsExit) {
        await expect(projectListCommand()).rejects.toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
      } else {
        await projectListCommand();
        expect(mockExit).not.toHaveBeenCalled();
      }
    });

    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);
      await expect(projectListCommand()).rejects.toThrow();
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("projectCreateCommand", () => {
    test.each([
      {
        scenario: "creates project successfully",
        configValue: MOCK_CONFIG,
        projectName: "New Project",
        fetchResponse: { ok: true, json: async () => MOCK_PROJECT_CREATED },
        expectsExit: false,
      },
      {
        scenario: "exits with 1 when API returns error",
        configValue: MOCK_CONFIG,
        projectName: "New Project",
        fetchResponse: { ok: false, json: async () => ({ error: "conflict" }) },
        expectsExit: true,
      },
    ])("$scenario", async ({ configValue, projectName, fetchResponse, expectsExit }) => {
      mockGetConfig.mockReturnValue(configValue);
      mockInput.mockResolvedValue(projectName);
      mockFetch.mockResolvedValue(fetchResponse);

      if (expectsExit) {
        await expect(projectCreateCommand()).rejects.toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
      } else {
        await projectCreateCommand();
        expect(mockExit).not.toHaveBeenCalled();
      }
    });

    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);
      await expect(projectCreateCommand()).rejects.toThrow();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when project name is empty", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockInput.mockResolvedValue("   ");
      await expect(projectCreateCommand()).rejects.toThrow();
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("projectDeleteCommand", () => {
    test.each([
      {
        scenario: "deletes project successfully",
        configValue: MOCK_CONFIG,
        selectedProject: { id: "proj-1", name: "Project Alpha" },
        fetchResponse: { ok: true, json: async () => ({}) },
        expectsExit: false,
      },
      {
        scenario: "exits with 1 when API returns error",
        configValue: MOCK_CONFIG,
        selectedProject: { id: "proj-1", name: "Project Alpha" },
        fetchResponse: { ok: false, json: async () => ({ error: "not found" }) },
        expectsExit: true,
      },
    ])("$scenario", async ({ configValue, selectedProject, fetchResponse, expectsExit }) => {
      mockGetConfig.mockReturnValue(configValue);
      mockSelectProject.mockResolvedValue(selectedProject);
      mockFetch.mockResolvedValue(fetchResponse);

      if (expectsExit) {
        await expect(projectDeleteCommand()).rejects.toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
      } else {
        await projectDeleteCommand();
        expect(mockExit).not.toHaveBeenCalled();
      }
    });

    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);
      await expect(projectDeleteCommand()).rejects.toThrow();
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
