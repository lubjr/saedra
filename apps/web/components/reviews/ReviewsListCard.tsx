import Link from "next/link";

import type { ReviewSummary } from "../../auth/reviews";

interface Props {
  projectId: string;
  reviews: ReviewSummary[];
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

const statusDot = (violations: number, warnings: number) => {
  if (violations > 0) return "bg-red-400";
  if (warnings > 0) return "bg-yellow-400";
  return "bg-teal-400";
};

const CountPill = ({ value, color }: { value: number; color: string }) => {
  return (
    <span
      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${color}`}
    >
      {value}
    </span>
  );
};

export const ReviewsListCard = ({ projectId, reviews }: Props) => {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center gap-3 py-16">
        <p className="text-sm text-zinc-500">No reviews yet.</p>
        <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-2 py-1.5 rounded">
          saedra review
        </code>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800">
        <p className="text-sm font-medium">
          All reviews{" "}
          <span className="font-mono text-zinc-500 text-[11px]">
            {reviews.length}
          </span>
        </p>
      </div>
      <ul className="divide-y divide-dashed divide-zinc-800">
        {reviews.map((review) => {
          return (
            <li key={review.id}>
              <Link
                href={`/dashboard/project/${projectId}/reviews/${review.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-800/50 transition-colors"
              >
                <span
                  className={`size-1.5 rounded-full shrink-0 ${statusDot(review.violations, review.warnings)}`}
                />
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-sm text-foreground">
                    {review.branch}
                  </span>
                  {review.base && (
                    <span className="font-mono text-xs text-zinc-500 ml-1.5">
                      ← {review.base}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {review.violations > 0 && (
                    <CountPill
                      value={review.violations}
                      color="bg-red-500/10 text-red-400 border-red-500/20"
                    />
                  )}
                  {review.warnings > 0 && (
                    <CountPill
                      value={review.warnings}
                      color="bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    />
                  )}
                  <CountPill
                    value={review.ok}
                    color="bg-teal-500/10 text-teal-400 border-teal-500/20"
                  />
                  <span className="text-[11px] font-mono text-zinc-600 ml-1">
                    {formatRelativeDate(review.created_at)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
