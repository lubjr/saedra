import { notFound } from "next/navigation";

import { getProjectReview } from "../../../../../../../auth/reviews";
import { ReviewDetailHeader } from "../../../../../../../components/reviews/ReviewDetailHeader";
import { ReviewKpiStrip } from "../../../../../../../components/reviews/ReviewKpiStrip";
import { ReviewPassedCard } from "../../../../../../../components/reviews/ReviewPassedCard";
import { ReviewViolationsCard } from "../../../../../../../components/reviews/ReviewViolationsCard";
import { ReviewWarningsCard } from "../../../../../../../components/reviews/ReviewWarningsCard";
import { SetReviewBreadcrumb } from "../../../../../../../components/reviews/SetReviewBreadcrumb";

interface PageProps {
  params: Promise<{ id: string; reviewId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, reviewId } = await params;
  const review = await getProjectReview(id, reviewId);

  if (!review) notFound();

  const violations = review.files.filter((f) => {
    return f.status === "violation";
  });
  const warnings = review.files.filter((f) => {
    return f.status === "warning";
  });
  const passed = review.files.filter((f) => {
    return f.status === "ok";
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <SetReviewBreadcrumb label={review.branch} />

      <ReviewDetailHeader review={review} />
      <ReviewKpiStrip review={review} />

      {violations.length > 0 && <ReviewViolationsCard files={violations} />}
      {warnings.length > 0 && <ReviewWarningsCard files={warnings} />}
      {passed.length > 0 && <ReviewPassedCard files={passed} />}
    </div>
  );
}
