import {
  CardSkeleton,
  PageHeaderSkeleton,
} from "../../../../../../components/skeletons/PageSkeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <PageHeaderSkeleton chips={1} actions={0} />
      {/* General, AI config, Danger zone */}
      <CardSkeleton bodyHeight={100} />
      <CardSkeleton bodyHeight={180} />
      <CardSkeleton bodyHeight={90} />
    </div>
  );
}
