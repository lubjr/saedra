import { Card, CardContent, CardHeader } from "@repo/ui/card";
import * as React from "react";

export const LegalPage = ({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative bg-card flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-fill/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-fill rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6">
        <Card className="bg-muted border-2 border-border-emphasis rounded-2xl shadow-sm">
          <CardHeader>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Last updated: {updated}
            </p>

            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Draft template — not a lawyer-reviewed legal document. It needs
              legal review before Saedra can rely on it as an official policy.
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground">
              {children}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const LegalSection = ({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{heading}</h2>
      <div className="mt-2 flex flex-col gap-3">{children}</div>
    </section>
  );
};
