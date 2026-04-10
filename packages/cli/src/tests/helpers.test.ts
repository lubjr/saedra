import { describe, test, expect, vi, beforeEach } from "vitest";
import * as contextModule from "../commands/context.js";
import * as prompts from "@inquirer/prompts";

vi.mock("../commands/context.js", () => ({
  findSaedraContext: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => ({
  select: vi.fn(),
}));

const mockFindSaedraContext = vi.mocked(contextModule.findSaedraContext);
const mockSelect = vi.mocked(prompts.select);

const { selectProject, selectDocument } = await import("../commands/helpers.js");

const MOCK_CONFIG = {
  email: "user@example.com",
  userId: "user-123",
  token: "tok_xyz",
  apiUrl: "https://api.example.com",
};

const MOCK_PROJECTS = [
  { id: "proj-1", name: "Project Alpha" },
  { id: "proj-2", name: "Project Beta" },
];

const MOCK_DOCUMENTS = [
  { id: "doc-1", name: "README.md" },
  { id: "doc-2", name: "SPEC.md" },
];

describe("helpers", () => {
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

  describe("selectProject", () => {
    test("returns context project directly when .saedra file exists", async () => {
      mockFindSaedraContext.mockReturnValue({
        projectId: "proj-1",
        projectName: "Project Alpha",
      });

      const result = await selectProject(MOCK_CONFIG);

      expect(result).toEqual({ id: "proj-1", name: "Project Alpha" });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    test("fetches projects and returns the one selected by user", async () => {
      mockFindSaedraContext.mockReturnValue(null);
      mockFetch.mockResolvedValue({ ok: true, json: async () => MOCK_PROJECTS });
      mockSelect.mockResolvedValue("proj-2");

      const result = await selectProject(MOCK_CONFIG);

      expect(result).toEqual({ id: "proj-2", name: "Project Beta" });
    });

    test("exits with 1 when projects fetch fails", async () => {
      mockFindSaedraContext.mockReturnValue(null);
      mockFetch.mockResolvedValue({ ok: false });

      await expect(selectProject(MOCK_CONFIG)).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when no projects found", async () => {
      mockFindSaedraContext.mockReturnValue(null);
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      await expect(selectProject(MOCK_CONFIG)).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("selectDocument", () => {
    test("fetches documents and returns the one selected by user", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => MOCK_DOCUMENTS });
      mockSelect.mockResolvedValue("doc-1");

      const result = await selectDocument(MOCK_CONFIG, "proj-1");

      expect(result).toEqual({ id: "doc-1", name: "README.md" });
    });

    test("exits with 1 when documents fetch fails", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(selectDocument(MOCK_CONFIG, "proj-1")).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });

    test("exits with 1 when no documents found", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => [] });

      await expect(selectDocument(MOCK_CONFIG, "proj-1")).rejects.toThrow();

      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
