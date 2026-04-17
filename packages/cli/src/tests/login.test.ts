import { describe, test, expect, vi, beforeEach } from "vitest";
import * as fs from "node:fs";

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  rmSync: vi.fn(),
}));

const mockFs = vi.mocked(fs);

const { getConfig, clearConfig } = await import("../commands/login.js");

const MOCK_CONFIG = {
  valid: {
    email: "user@example.com",
    userId: "abc-123",
    token: "tok_xyz",
    apiUrl: "https://saedra-api.onrender.com",
  },
};

const MOCK_RESPONSES = {
  configJson: JSON.stringify(MOCK_CONFIG.valid),
  malformedJson: "not-json{{{",
};

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getConfig", () => {
    test.each([
      {
        scenario: "returns null when config file does not exist",
        fileExists: false,
        fileContent: null,
        expected: null,
      },
      {
        scenario: "returns parsed config when file exists and is valid JSON",
        fileExists: true,
        fileContent: MOCK_RESPONSES.configJson,
        expected: MOCK_CONFIG.valid,
      },
      {
        scenario: "returns null when config file contains invalid JSON",
        fileExists: true,
        fileContent: MOCK_RESPONSES.malformedJson,
        expected: null,
      },
    ])("$scenario", ({ fileExists, fileContent, expected }) => {
      mockFs.existsSync.mockReturnValue(fileExists);
      if (fileContent) mockFs.readFileSync.mockReturnValue(fileContent);

      const result = getConfig();

      expect(result).toEqual(expected);
    });
  });

  describe("clearConfig", () => {
    test.each([
      {
        scenario: "removes config file when it exists",
        fileExists: true,
        expectsRmSync: true,
      },
      {
        scenario: "does nothing when config file does not exist",
        fileExists: false,
        expectsRmSync: false,
      },
    ])("$scenario", ({ fileExists, expectsRmSync }) => {
      mockFs.existsSync.mockReturnValue(fileExists);

      clearConfig();

      if (expectsRmSync) {
        expect(mockFs.rmSync).toHaveBeenCalledOnce();
      } else {
        expect(mockFs.rmSync).not.toHaveBeenCalled();
      }
    });
  });
});
