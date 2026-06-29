import { ShieldIcon } from "@repo/ui/lucide";

export const ConstraintsCard = ({ items }: { items: string[] }) => {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <ShieldIcon className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium">Constraints</p>
        <span className="font-mono text-[11px] text-muted-foreground">
          {items.length}
        </span>
      </div>
      <ul className="px-5 py-4 space-y-2.5">
        {items.map((c, i) => {
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
            >
              <span className="size-1.5 rounded-full bg-status-warning mt-2 shrink-0" />
              <span className="text-pretty">{c}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
