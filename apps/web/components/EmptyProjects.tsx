import { Button } from "@repo/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/empty";
import { ArrowUpRightIcon, IconFolderCode } from "@repo/ui/lucide";

export const EmptyProjects = () => {
  return (
    <div className="flex-col">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderCode />
          </EmptyMedia>
          <EmptyTitle>No Projects Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button>
              <a href="/dashboard/new-project">Create Project</a>
            </Button>
            <Button variant="outline" disabled>
              Import Project
            </Button>
          </div>
        </EmptyContent>
        <Button
          variant="link"
          asChild
          className="text-muted-foreground"
          size="sm"
        >
          <a href="/dashboard">
            Learn More <ArrowUpRightIcon />
          </a>
        </Button>
      </Empty>
    </div>
  );
};
