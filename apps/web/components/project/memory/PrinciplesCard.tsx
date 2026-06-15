import { CheckCircle2Icon } from "@repo/ui/lucide";

export const PrinciplesCard = ({ items }: { items: string[] }) => {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
        <CheckCircle2Icon className="size-4 text-zinc-400" />
        <p className="text-sm font-medium">Core principles</p>
        <span className="font-mono text-[11px] text-zinc-500">
          {items.length}
        </span>
      </div>
      <ul className="px-5 py-4 space-y-2.5">
        {items.map((p, i) => {
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-300"
            >
              <span className="size-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
              <span className="text-pretty">{p}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
