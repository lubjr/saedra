import {
  KpiStripSkeleton,
  ListCardSkeleton,
  PageHeaderSkeleton,
} from "../../../../../../../components/skeletons/PageSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeaderSkeleton chips={3} actions={1} />
      <KpiStripSkeleton />
      {/* Violations / warnings / passed files — count is data-dependent, so show one */}
      <ListCardSkeleton rows={4} />
    </div>
  );
}
