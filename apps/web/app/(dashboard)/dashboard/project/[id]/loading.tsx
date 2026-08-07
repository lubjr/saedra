import {
  KpiStripSkeleton,
  PageHeaderSkeleton,
  SplitCardsSkeleton,
} from "../../../../../components/skeletons/PageSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeaderSkeleton />
      <KpiStripSkeleton />
      <SplitCardsSkeleton mainHeight={260} sideHeights={[140, 140]} />
    </div>
  );
}
