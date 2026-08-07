import { Skeleton } from "@repo/ui/skeleton";

import {
  CardSkeleton,
  KpiStripSkeleton,
  PageHeaderSkeleton,
  SplitCardsSkeleton,
} from "../../../../../../components/skeletons/PageSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeaderSkeleton chips={2} actions={1} />
      <div className="space-y-5">
        <KpiStripSkeleton />
        {/* FolderPills — Decisions / Changes / Rules */}
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        {/* Default view: SummaryCard + the principles/constraints split */}
        <CardSkeleton bodyHeight={100} />
        <SplitCardsSkeleton mainHeight={200} sideHeights={[160, 160]} />
      </div>
    </div>
  );
}
