"use client";

import { Card } from "@repo/ui/card";
import { ArrowUpRightIcon, XIcon, ZapIcon } from "@repo/ui/lucide";
import * as React from "react";

export const SetupBanner = () => {
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    setDismissed(localStorage.getItem("home:setupBannerDismissed") === "true");
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("home:setupBannerDismissed", "true");
    setDismissed(true);
  };

  return (
    <Card className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 py-0 gap-0 shadow-none rounded-xl">
      <div className="p-4 flex items-center gap-3 justify-between">
        <div className="flex items-start gap-3">
          <div className="size-7 rounded-md bg-teal-500/10 text-teal-400 grid place-items-center shrink-0 mt-0.5">
            <ZapIcon className="size-4" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">Set up a new repository</p>
            <p className="text-sm text-muted-foreground">
              Run{" "}
              <code className="text-teal-400 font-mono text-xs bg-teal-500/10 px-1.5 py-0.5 rounded">
                saedra init --with-hooks
              </code>{" "}
              inside your repo to start tracking architectural context.{" "}
              <a
                href="https://docs.saedra.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 inline-flex items-center gap-0.5 transition-colors"
              >
                Full setup guide <ArrowUpRightIcon className="size-3" />
              </a>
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0 cursor-pointer"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </Card>
  );
};
