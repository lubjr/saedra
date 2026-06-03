"use client";

import { Button } from "@repo/ui/button";
import { CopyIcon } from "@repo/ui/lucide";
import * as React from "react";
import { toast } from "sonner";

export const ShareReviewButton = () => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    void navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <CopyIcon className="size-3.5" />
      {copied ? "Link copied" : "Share review"}
    </Button>
  );
};
