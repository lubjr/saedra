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
  if (violations > 0) return "bg-status-error";
  if (warnings > 0) return "bg-status-warning";
  return "bg-brand";
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
      <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center gap-3 py-16">
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
        <code className="text-brand font-mono text-xs bg-brand-fill px-2 py-1.5 rounded">
          saedra review
        </code>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-medium">
          All reviews{" "}
          <span className="font-mono text-muted-foreground text-[11px]">
            {reviews.length}
          </span>
        </p>
      </div>
      <ul className="divide-y divide-dashed divide-border">
        {reviews.map((review) => {
          return (
            <li key={review.id}>
              <Link
                href={`/dashboard/project/${projectId}/reviews/${review.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors"
              >
                <span
                  className={`size-1.5 rounded-full shrink-0 ${statusDot(review.violations, review.warnings)}`}
                />
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-sm text-foreground">
                    {review.branch}
                  </span>
                  {review.base && (
                    <span className="font-mono text-xs text-muted-foreground ml-1.5">
                      ← {review.base}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {review.violations > 0 && (
                    <CountPill
                      value={review.violations}
                      color="bg-status-error-fill text-status-error border-status-error-stroke"
                    />
                  )}
                  {review.warnings > 0 && (
                    <CountPill
                      value={review.warnings}
                      color="bg-status-warning-fill text-status-warning border-status-warning-stroke"
                    />
                  )}
                  <CountPill
                    value={review.ok}
                    color="bg-brand-fill text-brand border-brand-stroke"
                  />
                  <span className="text-[11px] font-mono text-muted-foreground ml-1">
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
