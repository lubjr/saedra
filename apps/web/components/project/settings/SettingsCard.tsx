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
  const borderCls = danger ? "border-status-error-stroke" : "border-border";
  const iconCls = danger
    ? "bg-status-error-fill text-status-error"
    : "bg-brand-fill text-brand";
  const titleCls = danger ? "text-status-error" : "text-foreground";

  return (
    <div className={`rounded-xl border bg-card overflow-hidden ${borderCls}`}>
      <div
        className={`flex flex-row items-start gap-3 border-b px-6 py-5 ${borderCls}`}
      >
        <span
          className={`size-7 rounded-md grid place-items-center shrink-0 mt-0.5 ${iconCls}`}
        >
          {icon}
        </span>
        <div className="space-y-1">
          <div className={`text-base font-semibold leading-none ${titleCls}`}>
            {title}
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed">
            {desc}
          </div>
        </div>
      </div>
      <div className="px-6 py-6">{children}</div>
      {footer && (
        <div
          className={`flex items-center justify-between border-t bg-background/40 px-6 py-3.5 ${borderCls}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
