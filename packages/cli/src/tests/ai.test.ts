import { describe, test, expect, vi, beforeEach } from "vitest";
import * as fs from "node:fs";

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  rmSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => ({
  select: vi.fn(),
  confirm: vi.fn(),
  password: vi.fn(),
}));

const mockFs = vi.mocked(fs);
import * as prompts from "@inquirer/prompts";

const mockConfirm = vi.mocked(prompts.confirm);

const { getAiConfig, aiStatusCommand, aiRemoveCommand } = await import("../commands/ai.js");

const MOCK_AI_CONFIG = {
  provider: "claude" as const,
  apiKey: "sk-ant-api-key-1234567890abcdef",
};

describe("ai", () => {
  const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
    throw new Error("process.exit");
  });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAiConfig", () => {
    test.each([
      {
        scenario: "returns null when AI config file does not exist",
        fileExists: false,
        fileContent: null,
        expected: null,
      },
      {
        scenario: "returns parsed config when file exists and is valid JSON",
        fileExists: true,
        fileContent: JSON.stringify(MOCK_AI_CONFIG),
        expected: MOCK_AI_CONFIG,
      },
      {
        scenario: "returns null when config file contains invalid JSON",
        fileExists: true,
        fileContent: "not-json{{{",
        expected: null,
      },
    ])("$scenario", ({ fileExists, fileContent, expected }) => {
      mockFs.existsSync.mockReturnValue(fileExists as boolean);
      if (fileContent) mockFs.readFileSync.mockReturnValue(fileContent);

      const result = getAiConfig();

      expect(result).toEqual(expected);
    });
  });

  describe("aiStatusCommand", () => {
    test("logs not configured message when no AI config found", async () => {
      mockFs.existsSync.mockReturnValue(false);

      await aiStatusCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("Not configured")
      );
    });

    test("logs provider and masked key when AI is configured", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(MOCK_AI_CONFIG));

      await aiStatusCommand();

      expect(mockExit).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(MOCK_AI_CONFIG.provider)
      );
    });
  });

  describe("aiRemoveCommand", () => {
    test("logs no config message when AI is not configured", async () => {
      mockFs.existsSync.mockReturnValue(false);

      await aiRemoveCommand();

      expect(mockFs.rmSync).not.toHaveBeenCalled();
    });

    test("aborts without removing when user does not confirm", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(MOCK_AI_CONFIG));
      mockConfirm.mockResolvedValue(false);

      await aiRemoveCommand();

      expect(mockFs.rmSync).not.toHaveBeenCalled();
    });

    test("removes config file when user confirms", async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(MOCK_AI_CONFIG));
      mockConfirm.mockResolvedValue(true);

      await aiRemoveCommand();

      expect(mockFs.rmSync).toHaveBeenCalledOnce();
    });
  });
});
