import { RouteIcon } from "@repo/ui/lucide";

const PathFlow = ({ text }: { text: string }) => {
  const parts = text.split(/→|->/);
  return (
    <span className="font-mono text-[13px] leading-relaxed">
      {parts.map((seg, i) => {
        return (
          <span key={i}>
            {i > 0 && <span className="text-muted-foreground px-1.5">→</span>}
            <span className="text-foreground/80">{seg.trim()}</span>
          </span>
        );
      })}
    </span>
  );
};

export const CriticalPathsCard = ({ items }: { items: string[] }) => {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <RouteIcon className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium">Critical paths</p>
        <span className="font-mono text-[11px] text-muted-foreground">
          {items.length}
        </span>
      </div>
      <ul className="px-5 py-4 space-y-3">
        {items.map((p, i) => {
          return (
            <li key={i} className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-muted-foreground shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <PathFlow text={p} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
