import { GitBranchIcon } from "@repo/ui/lucide";

import type { ReviewDetail } from "../../auth/reviews";
import { ShareReviewButton } from "./ShareReviewButton";

interface Props {
  review: ReviewDetail;
}

const formatRelativeDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const verdictChip = (violations: number, warnings: number) => {
  if (violations > 0)
    return { label: "failing", color: "text-red-400", dot: "bg-red-400" };
  if (warnings > 0)
    return { label: "warning", color: "text-yellow-400", dot: "bg-yellow-400" };
  return { label: "all clean", color: "text-teal-400", dot: "bg-teal-400" };
};

export const ReviewDetailHeader = ({ review }: Props) => {
  const verdict = verdictChip(review.violations, review.warnings);

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-400">
          Review detail
        </p>
        <h1 className="text-3xl font-semibold tracking-tight font-mono">
          {review.branch}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`flex items-center gap-1.5 rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs ${verdict.color}`}
          >
            <span className={`size-1.5 rounded-full ${verdict.dot}`} />
            {verdict.label}
          </span>
          {review.base && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
              <GitBranchIcon className="size-3" />← {review.base}
            </span>
          )}
          <span className="rounded-full bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 font-mono text-xs text-zinc-500">
            {formatRelativeDate(review.created_at)}
          </span>
        </div>
      </div>
      <div className="shrink-0 pt-1">
        <ShareReviewButton />
      </div>
    </div>
  );
};
