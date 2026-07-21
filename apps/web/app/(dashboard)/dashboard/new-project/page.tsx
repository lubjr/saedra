"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  FolderIcon,
  GitBranchIcon,
  SparklesIcon,
} from "@repo/ui/lucide";
import { Textarea } from "@repo/ui/textarea";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { useProjectLimit } from "../../../../hooks/useProjectLimit";
import { useProjects } from "../../../contexts/ProjectsContext";

const NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;
const REPO_REGEX = /^(https?:\/\/)?(github\.com|gitlab\.com)\//;

export default function Page() {
  const { create } = useProjects();
  const { isAtLimit } = useProjectLimit();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [linkedRepository, setLinkedRepository] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const nameValid = name.length > 0 && NAME_REGEX.test(name);
  const repoWarning =
    linkedRepository.length > 0 && !REPO_REGEX.test(linkedRepository);

  React.useEffect(() => {
    if (isAtLimit) {
      toast.error("Standard plan limit reached — upgrade to add more projects");
      router.replace("/dashboard");
    }
  }, [isAtLimit, router]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const result = await create({ name });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("Project created");
      const id = result.data?.id;
      if (id) {
        router.push(`/dashboard/project/${id}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAtLimit) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          Get started
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create project
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Start tracking architecture decisions and running AI-powered code
          reviews.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border overflow-hidden p-0 gap-0">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0 border-b border-border px-6 py-5">
            <span className="size-7 rounded-lg bg-brand-fill text-brand grid place-items-center shrink-0 mt-0.5">
              <SparklesIcon className="size-4" />
            </span>
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">
                New project
              </CardTitle>
              <CardDescription>
                Fields marked optional can be added later from project settings.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold flex items-center gap-1.5"
              >
                <FolderIcon className="size-3.5" />
                Project name
              </Label>
              <Input
                id="name"
                className="font-mono text-sm"
                placeholder="my-awesome-project"
                value={name}
                onChange={(e) => {
                  return setName(e.target.value);
                }}
                disabled={isLoading}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Used as the project identifier.{" "}
                <code className="font-mono text-xs bg-brand-fill text-brand px-1.5 py-0.5 rounded">
                  lowercase-with-dashes
                </code>{" "}
                works best.
                {nameValid && (
                  <span className="ml-1.5 text-brand">
                    <CheckCircle2Icon className="inline size-3 mb-0.5" />
                  </span>
                )}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold flex items-center gap-1.5"
              >
                <BookOpenIcon className="size-3.5" />
                Description
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-border-emphasis bg-background px-1.5 py-0.5 ml-0.5"
                >
                  Optional
                </Badge>
              </Label>
              <Textarea
                id="description"
                placeholder="What does this codebase do? Helps the AI ground reviews in context."
                rows={4}
                value={description}
                onChange={(e) => {
                  return setDescription(e.target.value);
                }}
                disabled
                className="resize-none text-sm"
              />
            </div>

            {/* Linked repository */}
            <div className="space-y-2">
              <Label
                htmlFor="repo"
                className="text-sm font-semibold flex items-center gap-1.5"
              >
                <GitBranchIcon className="size-3.5" />
                Linked repository
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-border-emphasis bg-background px-1.5 py-0.5 ml-0.5"
                >
                  Optional
                </Badge>
              </Label>
              <Input
                id="repo"
                className="font-mono text-sm"
                placeholder="github.com/your-org/your-repo"
                value={linkedRepository}
                onChange={(e) => {
                  return setLinkedRepository(e.target.value);
                }}
                disabled
              />
              {repoWarning ? (
                <p className="text-xs text-status-warning">
                  Use a github.com or gitlab.com URL.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Lets saedra read the current branch and link reviews to
                  commits.
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-border bg-background/40 px-6 py-3.5">
            <span className="text-sm text-muted-foreground">
              Will appear in your home as{" "}
              <code className="font-mono text-xs bg-brand-fill text-brand px-1.5 py-0.5 rounded">
                {name || "—"}
              </code>
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  return router.back();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="brand"
                disabled={!name.trim() || isLoading}
              >
                {isLoading ? (
                  "Creating..."
                ) : (
                  <>
                    Create project{" "}
                    <ChevronRightIcon className="size-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
