import { Button, LoadingIcon } from "@repo/ui";

export const Loading = () => {
  return (
    <Button size="sm" disabled className="inline-flex items-center gap-2">
      <LoadingIcon className="animate-spin h-4 w-4 shrink-0" />
      Please wait
    </Button>
  );
};
