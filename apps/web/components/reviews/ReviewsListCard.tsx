import type { BranchReviewGroup } from "./groupReviewsByBranch";
import { ReviewBranchGroupRow } from "./ReviewBranchGroupRow";

interface Props {
  projectId: string;
  groups: BranchReviewGroup[];
}

export const ReviewsListCard = ({ projectId, groups }: Props) => {
  const totalRuns = groups.reduce((sum, group) => {
    return sum + group.runs.length;
  }, 0);

  if (groups.length === 0) {
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
            {totalRuns}
          </span>
        </p>
      </div>
      <ul className="divide-y divide-dashed divide-border">
        {groups.map((group) => {
          return (
            <ReviewBranchGroupRow
              key={group.branch}
              projectId={projectId}
              group={group}
            />
          );
        })}
      </ul>
    </div>
  );
};
