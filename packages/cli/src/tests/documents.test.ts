import { describe, test, expect, vi, beforeEach } from "vitest";
import * as loginModule from "../commands/login.js";
import * as helpersModule from "../commands/helpers.js";
import * as fs from "node:fs";
import * as prompts from "@inquirer/prompts";

vi.mock("../commands/login.js", () => ({
  getConfig: vi.fn(),
}));

vi.mock("../commands/helpers.js", () => ({
  selectProject: vi.fn(),
  selectDocument: vi.fn(),
}));

vi.mock("node:fs", () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => ({
  input: vi.fn(),
  select: vi.fn(),
  confirm: vi.fn(),
}));

const mockGetConfig = vi.mocked(loginModule.getConfig);
const mockSelectProject = vi.mocked(helpersModule.selectProject);
const mockSelectDocument = vi.mocked(helpersModule.selectDocument);
const mockFs = vi.mocked(fs);
const mockInput = vi.mocked(prompts.input);
const mockConfirm = vi.mocked(prompts.confirm);

const {
  docCreateCommand,
  docListCommand,
  docReadCommand,
  docEditCommand,
  docDeleteCommand,
  docPushCommand,
} = await import("../commands/documents.js");

const MOCK_CONFIG = {
  email: "user@example.com",
  userId: "user-123",
  token: "tok_xyz",
  apiUrl: "https://api.example.com",
};

const MOCK_PROJECT = { id: "proj-1", name: "Test Project" };
const MOCK_DOCUMENT = { id: "doc-1", name: "README.md" };

const MOCK_DOCUMENTS = [
  {
    id: "doc-1",
    name: "README.md",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "doc-2",
    name: "SPEC.md",
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-16T00:00:00Z",
  },
];

const MOCK_CREATED_DOC = { id: "doc-new", name: "README.md" };

describe("documents", () => {
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

  describe("docCreateCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(docCreateCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when document name is empty", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockInput.mockResolvedValueOnce("   ");

      await expect(docCreateCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test.each([
      {
        scenario: "creates document successfully with blank content",
        docName: "README.md",
        filePath: "",
        fetchOk: true,
        expectsExit: false,
      },
      {
        scenario: "exits with 1 when API fails",
        docName: "README.md",
        filePath: "",
        fetchOk: false,
        expectsExit: true,
      },
    ])("$scenario", async ({ docName, filePath, fetchOk, expectsExit }) => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockInput.mockResolvedValueOnce(docName).mockResolvedValueOnce(filePath);
      mockFetch.mockResolvedValue({
        ok: fetchOk,
        json: async () => (fetchOk ? MOCK_CREATED_DOC : { error: "conflict" }),
        text: async () => JSON.stringify({ error: "conflict" }),
        status: fetchOk ? 201 : 409,
      });

      if (expectsExit) {
        await expect(docCreateCommand()).rejects.toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
      } else {
        await docCreateCommand();
        expect(mockExit).not.toHaveBeenCalled();
      }
    });

    test("creates document with file content when file path is provided", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockInput.mockResolvedValueOnce("README.md").mockResolvedValueOnce("./README.md");
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Hello World");
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => MOCK_CREATED_DOC,
        text: async () => JSON.stringify(MOCK_CREATED_DOC),
        status: 201,
      });

      await docCreateCommand();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining("Hello World"),
        })
      );
    });
  });

  describe("docListCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(docListCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test.each([
      {
        scenario: "lists documents when API succeeds",
        fetchDocs: MOCK_DOCUMENTS,
        fetchOk: true,
        expectsExit: false,
      },
      {
        scenario: "prints no documents message when list is empty",
        fetchDocs: [],
        fetchOk: true,
        expectsExit: false,
      },
      {
        scenario: "exits with 1 when API fails",
        fetchDocs: null,
        fetchOk: false,
        expectsExit: true,
      },
    ])("$scenario", async ({ fetchDocs, fetchOk, expectsExit }) => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({
        ok: fetchOk,
        json: async () => (fetchOk ? fetchDocs : { error: "unauthorized" }),
        text: async () => JSON.stringify({ error: "unauthorized" }),
        status: fetchOk ? 200 : 401,
      });

      if (expectsExit) {
        await expect(docListCommand()).rejects.toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
      } else {
        await docListCommand();
        expect(mockExit).not.toHaveBeenCalled();
      }
    });
  });

  describe("docReadCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(docReadCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("reads document by name when docName argument is provided", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [MOCK_DOCUMENT],
          text: async () => "[]",
          status: 200,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: "doc-1",
            name: "README.md",
            content: "# Hello",
            created_at: "2026-01-01T00:00:00Z",
            updated_at: "2026-01-01T00:00:00Z",
          }),
          text: async () => "{}",
          status: 200,
        });

      await docReadCommand("README.md");

      expect(mockExit).not.toHaveBeenCalled();
    });

    test("exits with 1 when document name is not found in project", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        text: async () => "[]",
        status: 200,
      });

      await expect(docReadCommand("MISSING.md")).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("uses selectDocument when no docName is provided", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockSelectDocument.mockResolvedValue(MOCK_DOCUMENT);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "doc-1",
          name: "README.md",
          content: "# Hello",
          created_at: "2026-01-01T00:00:00Z",
          updated_at: "2026-01-01T00:00:00Z",
        }),
        text: async () => "{}",
        status: 200,
      });

      await docReadCommand();

      expect(mockSelectDocument).toHaveBeenCalledWith(MOCK_CONFIG, MOCK_PROJECT.id);
    });
  });

  describe("docEditCommand", () => {
    test("exits with 1 when file path is empty", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockSelectDocument.mockResolvedValue(MOCK_DOCUMENT);
      mockInput.mockResolvedValue("   ");

      await expect(docEditCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test.each([
      {
        scenario: "updates document successfully",
        fetchOk: true,
        expectsExit: false,
      },
      {
        scenario: "exits with 1 when API fails",
        fetchOk: false,
        expectsExit: true,
      },
    ])("$scenario", async ({ fetchOk, expectsExit }) => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockSelectDocument.mockResolvedValue(MOCK_DOCUMENT);
      mockInput.mockResolvedValue("./README.md");
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Updated content");
      mockFetch.mockResolvedValue({
        ok: fetchOk,
        json: async () => (fetchOk ? {} : { error: "not found" }),
        text: async () => JSON.stringify({ error: "not found" }),
        status: fetchOk ? 200 : 404,
      });

      if (expectsExit) {
        await expect(docEditCommand()).rejects.toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
      } else {
        await docEditCommand();
        expect(mockExit).not.toHaveBeenCalled();
      }
    });
  });

  describe("docDeleteCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(docDeleteCommand()).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test.each([
      {
        scenario: "deletes document successfully",
        fetchOk: true,
        expectsExit: false,
      },
      {
        scenario: "exits with 1 when API fails",
        fetchOk: false,
        expectsExit: true,
      },
    ])("$scenario", async ({ fetchOk, expectsExit }) => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockSelectDocument.mockResolvedValue(MOCK_DOCUMENT);
      mockFetch.mockResolvedValue({
        ok: fetchOk,
        json: async () => (fetchOk ? {} : { error: "not found" }),
        text: async () => JSON.stringify({ error: "not found" }),
        status: fetchOk ? 200 : 404,
      });

      if (expectsExit) {
        await expect(docDeleteCommand()).rejects.toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
      } else {
        await docDeleteCommand();
        expect(mockExit).not.toHaveBeenCalled();
      }
    });
  });

  describe("docPushCommand", () => {
    test("exits with 1 when not authenticated", async () => {
      mockGetConfig.mockReturnValue(null);

      await expect(docPushCommand("./README.md")).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("creates new document when it does not exist in project", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Hello");
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => [], text: async () => "[]", status: 200 })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => MOCK_CREATED_DOC,
          text: async () => "{}",
          status: 201,
        });

      await docPushCommand("./README.md");

      expect(mockExit).not.toHaveBeenCalled();
    });

    test("updates existing document when name matches and user confirms", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Updated");
      mockConfirm.mockResolvedValue(true);
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: "doc-1", name: "README.md" }],
          text: async () => "[]",
          status: 200,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {},
          text: async () => "{}",
          status: 200,
        });

      await docPushCommand("./README.md");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("doc-1"),
        expect.objectContaining({ method: "PUT" })
      );
    });

    test("aborts when existing document update is not confirmed", async () => {
      mockGetConfig.mockReturnValue(MOCK_CONFIG);
      mockSelectProject.mockResolvedValue(MOCK_PROJECT);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue("# Content");
      mockConfirm.mockResolvedValue(false);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [{ id: "doc-1", name: "README.md" }],
        text: async () => "[]",
        status: 200,
      });

      await docPushCommand("./README.md");

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
