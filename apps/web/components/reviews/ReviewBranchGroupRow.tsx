"use client";

import { ChevronDownIcon } from "@repo/ui/lucide";
import Link from "next/link";
import * as React from "react";

import type { ReviewSummary } from "../../auth/reviews";
import type { BranchReviewGroup } from "./groupReviewsByBranch";

interface Props {
  projectId: string;
  group: BranchReviewGroup;
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

const ReviewRunRow = ({
  projectId,
  review,
  muted,
}: {
  projectId: string;
  review: ReviewSummary;
  muted?: boolean;
}) => {
  return (
    <Link
      href={`/dashboard/project/${projectId}/reviews/${review.id}`}
      className={`flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors ${muted ? "pl-9" : ""}`}
    >
      <span
        className={`size-1.5 rounded-full shrink-0 ${statusDot(review.violations, review.warnings)}`}
      />
      <div className="min-w-0 flex-1">
        <span
          className={`font-mono text-sm ${muted ? "text-muted-foreground" : "text-foreground"}`}
        >
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
  );
};

export const ReviewBranchGroupRow = ({ projectId, group }: Props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [latest, ...history] = group.runs;
  if (!latest) return null;

  return (
    <li>
      <ReviewRunRow projectId={projectId} review={latest} />
      {history.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => {
              return setExpanded((prev) => {
                return !prev;
              });
            }}
            className="flex items-center gap-1.5 px-5 pb-3 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronDownIcon
              className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
            {history.length} execuções anteriores
          </button>
          {expanded && (
            <ul className="divide-y divide-dashed divide-border border-t border-dashed border-border">
              {history.map((review) => {
                return (
                  <li key={review.id}>
                    <ReviewRunRow projectId={projectId} review={review} muted />
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </li>
  );
};
