import { Skeleton } from "@repo/ui/skeleton";

/**
 * Shared skeleton pieces for the route-level `loading.tsx` files under
 * `app/(dashboard)`. Shapes mirror the real headers/strips/cards so the swap
 * from skeleton to content doesn't shift the layout.
 */

const times = (n: number): number[] => {
  return Array.from({ length: n }, (_, i) => {
    return i;
  });
};

interface PageHeaderSkeletonProps {
  /** Metadata chips rendered under the title (status, branch, timestamp). */
  chips?: number;
  /** Action buttons rendered on the right of the real header. */
  actions?: number;
}

export const PageHeaderSkeleton = ({
  chips = 3,
  actions = 2,
}: PageHeaderSkeletonProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72" />
        {chips > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {times(chips).map((i) => {
              return <Skeleton key={i} className="h-5 w-24 rounded-full" />;
            })}
          </div>
        )}
      </div>
      {actions > 0 && (
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {times(actions).map((i) => {
            return <Skeleton key={i} className="h-8 w-32 rounded-md" />;
          })}
        </div>
      )}
    </div>
  );
};

/** Matches the `grid grid-cols-2 sm:grid-cols-4` stat tiles used on every project page. */
export const KpiStripSkeleton = ({ tiles = 4 }: { tiles?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {times(tiles).map((i) => {
        return (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        );
      })}
    </div>
  );
};

interface CardSkeletonProps {
  /** Body height in px, excluding the card's title row and padding. */
  bodyHeight?: number;
  /** Render the title line above the body. */
  title?: boolean;
}

export const CardSkeleton = ({
  bodyHeight = 120,
  title = true,
}: CardSkeletonProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {title && <Skeleton className="h-4 w-32" />}
      <Skeleton
        className="w-full rounded-lg"
        style={{ height: `${bodyHeight}px` }}
      />
    </div>
  );
};

/** Card whose body is a stack of uniform rows (reviews list, violations list). */
export const ListCardSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2">
        {times(rows).map((i) => {
          return <Skeleton key={i} className="h-10 w-full rounded-lg" />;
        })}
      </div>
    </div>
  );
};

/** The `[1.55fr_1fr]` split used by Overview, Memory and Metrics. */
export const SplitCardsSkeleton = ({
  mainHeight = 260,
  sideHeights = [140, 140],
}: {
  mainHeight?: number;
  sideHeights?: number[];
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-5 items-start">
      <CardSkeleton bodyHeight={mainHeight} />
      <div className="flex flex-col gap-5">
        {sideHeights.map((height, i) => {
          return <CardSkeleton key={i} bodyHeight={height} />;
        })}
      </div>
    </div>
  );
};

/**
 * Home skeleton — shared by `dashboard/loading.tsx` (route transition) and the
 * `isLoading` branch of the Home page itself (SWR revalidation), so the two
 * loading states are visually identical.
 */
export const HomeSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Skeleton className="w-full rounded-2xl" style={{ height: "240px" }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Skeleton className="w-full rounded-xl" style={{ height: "140px" }} />
        <Skeleton className="w-full rounded-xl" style={{ height: "140px" }} />
        <Skeleton className="w-full rounded-xl" style={{ height: "140px" }} />
      </div>
    </div>
  );
};
