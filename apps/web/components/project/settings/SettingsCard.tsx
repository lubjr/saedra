import * as React from "react";

interface Props {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
  danger?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const SettingsCard = ({
  icon,
  title,
  desc,
  danger = false,
  footer,
  children,
}: Props) => {
  const borderCls = danger ? "border-red-500/20" : "border-zinc-800";
  const iconCls = danger
    ? "bg-red-500/10 text-red-400"
    : "bg-teal-500/10 text-teal-400";
  const titleCls = danger ? "text-red-400" : "text-zinc-100";

  return (
    <div
      className={`rounded-xl border bg-zinc-900 overflow-hidden ${borderCls}`}
    >
      <div
        className={`flex flex-row items-start gap-3 border-b px-6 py-5 ${borderCls}`}
      >
        <span
          className={`size-7 rounded-lg grid place-items-center shrink-0 mt-0.5 ${iconCls}`}
        >
          {icon}
        </span>
        <div className="space-y-1">
          <div className={`text-base font-semibold leading-none ${titleCls}`}>
            {title}
          </div>
          <div className="text-sm text-zinc-400 leading-relaxed">{desc}</div>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
      {footer && (
        <div
          className={`flex items-center justify-between border-t bg-zinc-950/40 px-6 py-3.5 ${borderCls}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
