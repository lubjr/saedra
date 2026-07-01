import type { ReviewSummary } from "../../auth/reviews";

export interface BranchReviewGroup {
  branch: string;
  runs: ReviewSummary[];
}

export const groupReviewsByBranch = (
  reviews: ReviewSummary[],
): BranchReviewGroup[] => {
  const groups = new Map<string, ReviewSummary[]>();

  for (const review of reviews) {
    const runs = groups.get(review.branch);
    if (runs) {
      runs.push(review);
    } else {
      groups.set(review.branch, [review]);
    }
  }

  return Array.from(groups, ([branch, runs]) => {
    return { branch, runs };
  }).sort((a, b) => {
    return (
      new Date(b.runs[0].created_at).getTime() -
      new Date(a.runs[0].created_at).getTime()
    );
  });
};
