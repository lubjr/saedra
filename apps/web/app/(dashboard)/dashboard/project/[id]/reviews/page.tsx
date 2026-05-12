import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { SearchIcon } from "@repo/ui/lucide";
import Link from "next/link";

import { getProjectReviews } from "../../../../../../auth/reviews";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusColor = {
  violation: "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ok: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const reviewStatus = (violations: number, warnings: number) => {
  if (violations > 0) return "violation";
  if (warnings > 0) return "warning";
  return "ok";
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const reviews = await getProjectReviews(id);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2">
          Review History
        </h1>
        <p className="text-sm text-muted-foreground">
          All architectural reviews run for this project.
        </p>
      </div>

      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Reviews
          </CardTitle>
          <CardDescription>
            Each entry is a review triggered by{" "}
            <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
              saedra review
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-0">
              {reviews.map((review, i) => {
                const status = reviewStatus(review.violations, review.warnings);
                return (
                  <Link
                    key={review.id}
                    href={`/dashboard/project/${id}/reviews/${review.id}`}
                    className={`flex items-start justify-between gap-4 py-4 hover:bg-zinc-800/50 -mx-2 px-2 rounded transition-colors ${
                      i < reviews.length - 1 ? "border-b border-zinc-800" : ""
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-medium text-white">
                          {review.branch}
                        </code>
                        {review.base && (
                          <span className="text-xs text-muted-foreground">
                            ← {review.base}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.total_files} file
                        {review.total_files !== 1 ? "s" : ""} reviewed
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {review.violations > 0 && (
                        <Badge
                          variant="outline"
                          className={statusColor.violation}
                        >
                          {review.violations} violation
                          {review.violations !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      {review.warnings > 0 && (
                        <Badge
                          variant="outline"
                          className={statusColor.warning}
                        >
                          {review.warnings} warning
                          {review.warnings !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      <Badge variant="outline" className={statusColor[status]}>
                        {review.ok} ok
                      </Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews found. Run{" "}
              <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                saedra review
              </code>{" "}
              inside your repository to trigger the first review.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
