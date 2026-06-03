import { ChevronRightIcon } from "@repo/ui/lucide";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectReview } from "../../../../../../../auth/reviews";
import { ReviewDetailHeader } from "../../../../../../../components/reviews/ReviewDetailHeader";
import { ReviewKpiStrip } from "../../../../../../../components/reviews/ReviewKpiStrip";
import { ReviewPassedCard } from "../../../../../../../components/reviews/ReviewPassedCard";
import { ReviewViolationsCard } from "../../../../../../../components/reviews/ReviewViolationsCard";
import { ReviewWarningsCard } from "../../../../../../../components/reviews/ReviewWarningsCard";

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
      <Link
        href={`/dashboard/project/${id}/reviews`}
        className="flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors w-fit"
      >
        <ChevronRightIcon className="size-3 rotate-180" />
        Reviews
      </Link>

      <ReviewDetailHeader review={review} />
      <ReviewKpiStrip review={review} />

      {violations.length > 0 && <ReviewViolationsCard files={violations} />}
      {warnings.length > 0 && <ReviewWarningsCard files={warnings} />}
      {passed.length > 0 && <ReviewPassedCard files={passed} />}
    </div>
  );
}
