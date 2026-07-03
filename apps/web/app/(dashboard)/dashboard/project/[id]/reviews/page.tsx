import { getProjectReviews } from "../../../../../../auth/reviews";
import { groupReviewsByBranch } from "../../../../../../components/reviews/groupReviewsByBranch";
import { ReviewsHeader } from "../../../../../../components/reviews/ReviewsHeader";
import { ReviewsKpiStrip } from "../../../../../../components/reviews/ReviewsKpiStrip";
import { ReviewsListCard } from "../../../../../../components/reviews/ReviewsListCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const reviews = await getProjectReviews(id);
  const groups = groupReviewsByBranch(reviews);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <ReviewsHeader projectId={id} reviews={reviews} />
      <ReviewsKpiStrip reviews={reviews} />
      <ReviewsListCard projectId={id} groups={groups} />
    </div>
  );
}
