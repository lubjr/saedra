import { Badge } from "@repo/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { CheckIcon, ClockIcon, SearchIcon, ShieldIcon } from "@repo/ui/lucide";
import { notFound } from "next/navigation";

import { getProjectReview } from "../../../../../../../auth/reviews";

interface PageProps {
  params: Promise<{ id: string; reviewId: string }>;
}

const statusColor = {
  violation: "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ok: "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

const statusIcon = {
  violation: "⚠",
  warning: "⚡",
  ok: "✓",
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

export default async function Page({ params }: PageProps) {
  const { id, reviewId } = await params;
  const review = await getProjectReview(id, reviewId);

  if (!review) notFound();

  const violations = review.files.filter((f) => {
    return f.status === "violation";
  });
  const warnings = review.files.filter((f) => {
    return f.status === "warning";
  });
  const okFiles = review.files.filter((f) => {
    return f.status === "ok";
  });
  const ordered = [...violations, ...warnings, ...okFiles];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight py-2 font-mono">
          {review.branch}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(review.created_at)}
          {review.base && ` — compared against ${review.base}`}
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-zinc-900 py-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4 text-red-400 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-red-400">
                  {review.violations}
                </p>
                <p className="text-xs text-muted-foreground">
                  violation{review.violations !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 py-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-yellow-400 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {review.warnings}
                </p>
                <p className="text-xs text-muted-foreground">
                  warning{review.warnings !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 py-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-teal-400 shrink-0" />
              <div>
                <p className="text-2xl font-bold text-teal-400">{review.ok}</p>
                <p className="text-xs text-muted-foreground">ok</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File results */}
      <Card className="bg-zinc-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Files Reviewed
          </CardTitle>
          <CardDescription>
            {review.total_files} file{review.total_files !== 1 ? "s" : ""}{" "}
            analyzed in this review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {ordered.map((file, i) => {
              return (
                <div
                  key={file.file}
                  className={`py-4 ${i < ordered.length - 1 ? "border-b border-zinc-800" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {statusIcon[file.status]}
                        </span>
                        <code className="text-sm font-mono text-white truncate">
                          {file.file}
                        </code>
                      </div>
                      {file.note && (
                        <p className="text-xs text-muted-foreground pl-5">
                          {file.note}
                        </p>
                      )}
                      {file.violations.length > 0 && (
                        <ul className="pl-5 space-y-1 mt-2">
                          {file.violations.map((v, vi) => {
                            return (
                              <li key={vi} className="space-y-0.5">
                                <p className="text-xs font-mono text-muted-foreground">
                                  {v.rule_id}
                                </p>
                                <p className="text-xs text-zinc-300">
                                  {v.detail}
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`${statusColor[file.status]} shrink-0`}
                    >
                      {file.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
