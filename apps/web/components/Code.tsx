import { FileUpIcon, SquareSlashIcon } from "@repo/ui/lucide";
import { Textarea } from "@repo/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";

export const Code = () => {
  return (
    <div className="flex-col">
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-1xl font-bold text-white">
          How to analyze your IaC?
        </h1>
        <p className="text-zinc-400 text-sm">
          Secure and optimize your IaC with AI.
        </p>
      </div>

      <div className="w-96 bg-zinc-800 rounded border border-zinc-700 flex flex-col">
        <Textarea
          className="w-full min-h-[150px] max-h-[300px] bg-zinc-800 text-sm text-white font-mono p-4 pr-10 resize-none focus:outline-none overflow-y-auto"
          placeholder="Type your message here..."
        />

        <div className="flex items-center justify-start gap-2 px-3 py-2 text-zinc-500 text-xs border-t border-zinc-700">
          <ToggleGroup type="single" className="flex gap-1" disabled>
            <ToggleGroupItem value="upload" aria-label="Toggle upload">
              <FileUpIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="commands" aria-label="Toggle commands">
              <SquareSlashIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};
