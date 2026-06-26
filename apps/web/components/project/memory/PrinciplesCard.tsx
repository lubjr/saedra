import { CheckCircle2Icon } from "@repo/ui/lucide";

export const PrinciplesCard = ({ items }: { items: string[] }) => {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <CheckCircle2Icon className="size-4 text-muted-foreground" />
        <p className="text-sm font-medium">Core principles</p>
        <span className="font-mono text-[11px] text-muted-foreground">
          {items.length}
        </span>
      </div>
      <ul className="px-5 py-4 space-y-2.5">
        {items.map((p, i) => {
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
            >
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <span className="text-pretty">{p}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
