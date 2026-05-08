import { serviceClient } from "@repo/db-connector/db";

interface FileResult {
  file: string;
  status: "violation" | "warning" | "ok";
  violations: Array<{ rule_id: string; detail: string }>;
  note: string;
}

interface InsertReviewData {
  branch: string;
  base: string | null;
  total_files: number;
  violations: number;
  warnings: number;
  ok: number;
  files: FileResult[];
}

type ReviewDBType = {
  insertReview(projectId: string, data: InsertReviewData): Promise<any>;
  getReviewsByProject(projectId: string): Promise<any>;
  getReviewById(reviewId: string): Promise<any>;
};

export const ReviewDB: ReviewDBType = {
  async insertReview(projectId: string, data: InsertReviewData) {
    return serviceClient
      .from("reviews")
      .insert({
        project_id: projectId,
        branch: data.branch,
        base: data.base,
        total_files: data.total_files,
        violations: data.violations,
        warnings: data.warnings,
        ok: data.ok,
        files: data.files,
      })
      .select()
      .single();
  },

  async getReviewsByProject(projectId: string) {
    return serviceClient
      .from("reviews")
      .select("id, project_id, branch, base, total_files, violations, warnings, ok, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
  },

  async getReviewById(reviewId: string) {
    return serviceClient
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();
  },
};
