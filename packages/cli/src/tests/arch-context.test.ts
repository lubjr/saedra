import { describe, test, expect, vi, beforeEach } from "vitest";

const { fetchState, fetchDecisions, fetchChanges, fetchRules } = await import(
  "../commands/arch-context.js"
);

const MOCK_API_URL = "https://api.example.com";
const MOCK_PROJECT_ID = "proj-1";
const MOCK_TOKEN = "tok_xyz";

const MOCK_STATE = {
  version: "2026-01-01",
  summary: "Monorepo with Supabase and AWS Bedrock",
  core_principles: ["SOLID", "DRY"],
  critical_paths: ["web → api → db-queries → Supabase"],
  constraints: ["No direct DB access from UI"],
  active_decisions: ["DEC-2026-01-01-auth"],
};

const MOCK_DECISION = {
  id: "DEC-2026-01-01-auth",
  title: "Auth via Supabase",
  status: "active" as const,
  context: "We needed auth",
  decision: "Use Supabase Auth",
  impact: ["All user flows require valid session"],
  affects: ["web", "api"],
  constraints_introduced: ["No custom JWT implementation"],
  supersedes: null,
  risk_level: "low" as const,
  created_at: "2026-01-01T00:00:00Z",
};

const MOCK_CHANGE = {
  id: "CHG-2026-01-10-add-login",
  summary: "Add login flow",
  related_decisions: ["DEC-2026-01-01-auth"],
  files_changed: ["apps/web/app/login/page.tsx"],
  architectural_impact: "New auth entry point",
  risk_assessment: "Low",
  created_at: "2026-01-10T00:00:00Z",
};

const MOCK_RULE = {
  id: "RULE-2026-01-01-no-direct-db",
  description: "No direct DB access from UI layer",
  severity: "high" as const,
  related_decision: "DEC-2026-01-01-auth",
  created_at: "2026-01-01T00:00:00Z",
};

describe("arch-context", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = mockFetch as typeof globalThis.fetch;
  });

  describe("fetchState", () => {
    test.each([
      {
        scenario: "returns null when fetch fails",
        fetchOk: false,
        expected: null,
      },
      {
        scenario: "returns null when no architecture docs found",
        fetchOk: true,
        docs: [],
        expected: null,
      },
    ])("$scenario", async ({ fetchOk, expected }) => {
      mockFetch.mockResolvedValue({ ok: fetchOk, json: async () => [] });

      const result = await fetchState(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toEqual(expected);
    });

    test("returns parsed state when architecture doc exists", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: "doc-state-1", content: "" }],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { content: JSON.stringify(MOCK_STATE) } }),
        });

      const result = await fetchState(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toEqual(MOCK_STATE);
    });

    test("returns null when architecture doc detail fetch fails", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: "doc-state-1", content: "" }],
        })
        .mockResolvedValueOnce({ ok: false });

      const result = await fetchState(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toBeNull();
    });

    test("returns null when state content is invalid JSON", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: "doc-state-1", content: "" }],
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ content: "invalid-json{{{" }),
        });

      const result = await fetchState(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toBeNull();
    });
  });

  describe("fetchDecisions", () => {
    test("returns empty array when fetch fails", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const result = await fetchDecisions(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toEqual([]);
    });

    test("returns only active decisions, skipping deprecated and malformed ones", async () => {
      const docs = [
        { id: "doc-1", content: JSON.stringify(MOCK_DECISION) },
        {
          id: "doc-2",
          content: JSON.stringify({ ...MOCK_DECISION, id: "DEC-2", status: "deprecated" }),
        },
        { id: "doc-3", content: "not-json" },
      ];
      mockFetch.mockResolvedValue({ ok: true, json: async () => docs });

      const result = await fetchDecisions(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(MOCK_DECISION.id);
    });

    test("returns empty array when all decisions are not active", async () => {
      const docs = [
        {
          id: "doc-1",
          content: JSON.stringify({ ...MOCK_DECISION, status: "superseded" }),
        },
      ];
      mockFetch.mockResolvedValue({ ok: true, json: async () => docs });

      const result = await fetchDecisions(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toEqual([]);
    });
  });

  describe("fetchChanges", () => {
    test("returns empty array when fetch fails", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const result = await fetchChanges(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toEqual([]);
    });

    test("returns changes up to the given limit", async () => {
      const changes = Array.from({ length: 10 }, (_, i) => ({
        ...MOCK_CHANGE,
        id: `CHG-2026-01-0${i + 1}-change-${i}`,
        summary: `Change ${i}`,
      }));

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => changes.map((c) => ({ id: c.id, content: JSON.stringify(c) })),
      });

      const result = await fetchChanges(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN, 3);

      expect(result).toHaveLength(3);
    });

    test("uses default limit of 5 when no limit provided", async () => {
      const changes = Array.from({ length: 8 }, (_, i) => ({
        ...MOCK_CHANGE,
        id: `CHG-2026-01-0${i + 1}-change-${i}`,
      }));

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => changes.map((c) => ({ id: c.id, content: JSON.stringify(c) })),
      });

      const result = await fetchChanges(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toHaveLength(5);
    });

    test("skips malformed change entries", async () => {
      const docs = [
        { id: "doc-1", content: JSON.stringify(MOCK_CHANGE) },
        { id: "doc-2", content: "not-json" },
      ];
      mockFetch.mockResolvedValue({ ok: true, json: async () => docs });

      const result = await fetchChanges(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toHaveLength(1);
    });
  });

  describe("fetchRules", () => {
    test("returns empty array when fetch fails", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      const result = await fetchRules(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toEqual([]);
    });

    test("returns parsed rules skipping malformed entries", async () => {
      const docs = [
        { id: "doc-1", content: JSON.stringify(MOCK_RULE) },
        { id: "doc-2", content: "not-json" },
      ];
      mockFetch.mockResolvedValue({ ok: true, json: async () => docs });

      const result = await fetchRules(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(MOCK_RULE.id);
    });

    test("returns all valid rules", async () => {
      const rule2 = { ...MOCK_RULE, id: "RULE-2026-01-02-no-raw-sql", severity: "medium" as const };
      const docs = [
        { id: "doc-1", content: JSON.stringify(MOCK_RULE) },
        { id: "doc-2", content: JSON.stringify(rule2) },
      ];
      mockFetch.mockResolvedValue({ ok: true, json: async () => docs });

      const result = await fetchRules(MOCK_API_URL, MOCK_PROJECT_ID, MOCK_TOKEN);

      expect(result).toHaveLength(2);
    });
  });
});
