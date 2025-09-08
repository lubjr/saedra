import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";

export const ButtonPanel = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled variant="outline">
          Early Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Enter your access code</DialogTitle>
          <DialogDescription>
            Use your code to unlock early access to the beta panel.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input id="access-code" placeholder="Your access code" />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
