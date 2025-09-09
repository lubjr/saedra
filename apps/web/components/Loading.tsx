import { Button } from "@repo/ui/button";
import { LoadingIcon } from "@repo/ui/lucide";

export const Loading = () => {
  return (
    <Button
      size="sm"
      variant="secondary"
      disabled
      className="inline-flex items-center gap-2"
    >
      <LoadingIcon className="animate-spin h-4 w-4 shrink-0" />
      Please wait
    </Button>
  );
};
