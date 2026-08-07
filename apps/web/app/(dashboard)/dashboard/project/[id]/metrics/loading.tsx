import {
  CardSkeleton,
  KpiStripSkeleton,
  PageHeaderSkeleton,
  SplitCardsSkeleton,
} from "../../../../../../components/skeletons/PageSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Header carries a range selector + export, so two actions like the real one */}
      <PageHeaderSkeleton chips={2} />
      <KpiStripSkeleton />
      {/* ViolationsCard — the tallest block on this route */}
      <CardSkeleton bodyHeight={240} />
      <SplitCardsSkeleton mainHeight={280} sideHeights={[120, 180]} />
    </div>
  );
}
