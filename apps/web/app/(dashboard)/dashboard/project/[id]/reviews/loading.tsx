import {
  KpiStripSkeleton,
  ListCardSkeleton,
  PageHeaderSkeleton,
} from "../../../../../../components/skeletons/PageSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeaderSkeleton chips={2} />
      <KpiStripSkeleton />
      {/* Reviews grouped by branch */}
      <ListCardSkeleton rows={6} />
    </div>
  );
}
