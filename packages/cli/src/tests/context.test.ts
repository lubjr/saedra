import { describe, test, expect, vi, beforeEach } from "vitest";
import * as fs from "node:fs";

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  chmodSync: vi.fn(),
}));

vi.mock("../commands/login.js", () => ({
  getConfig: vi.fn(),
}));

vi.mock("../commands/helpers.js", () => ({
  selectProject: vi.fn(),
}));

const mockFs = vi.mocked(fs);
import * as loginModule from "../commands/login.js";
import * as helpersModule from "../commands/helpers.js";

const mockGetConfig = vi.mocked(loginModule.getConfig);
const mockSelectProject = vi.mocked(helpersModule.selectProject);

const { findSaedraContext, initCommand } = await import("../commands/context.js");

const MOCK_CONFIG = {
  email: "user@example.com",
  userId: "user-123",
  token: "tok_xyz",
  apiUrl: "https://api.example.com",
};

const MOCK_PROJECT = { id: "proj-1", name: "Test Project" };

const MOCK_CONTEXT = {
  projectId: "proj-1",
  projectName: "Test Project",
};

describe("context", () => {
  const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("process.exit");
  });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findSaedraContext", () => {
    test.each([
      {
        scenario: "returns null when no .saedra file found in any parent directory",
        fileExists: false,
        fileContent: null,
        expected: null,
      },
      {
        scenario: "returns parsed context when .saedra file exists",
        fileExists: true,
        fileContent: JSON.stringify(MOCK_CONTEXT),
        expected: MOCK_CONTEXT,
      },
      {
        scenario: "returns null when .saedra file contains invalid JSON",
        fileExists: true,
        fileContent: "invalid-json{{{",
        expected: null,
      },
    ])("$scenario", ({ fileExists, fileContent, expected }) => {
      mockFs.existsSync.mockReturnValue(fileExists as boolean);
      if (fileContent) mockFs.readFileSync.mockReturnValue(fileContent);

      const result = findSaedraContext();

      expect(result).toEqual(expected);
    });
  });

  describe("initCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(initCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("writes .saedra file with project context", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);

      await initCommand();

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        ".saedra",
        expect.stringContaining(MOCK_PROJECT.id)
      );
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});
