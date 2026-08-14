"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { mutate } from "swr";

type InvalidateEvent = {
  type: "invalidate";
  resource: string;
};

const SWR_KEYS = new Set(["projects", "user"]);

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  React.useEffect(() => {
    const source = new EventSource("/api/events");

    source.onmessage = (message) => {
      let event: InvalidateEvent;

      try {
        event = JSON.parse(message.data);
      } catch {
        return;
      }

      if (event.type !== "invalidate") {
        return;
      }

      if (SWR_KEYS.has(event.resource)) {
        mutate(event.resource);
        return;
      }

      router.refresh();
    };

    return () => {
      source.close();
    };
  }, [router]);

  return <>{children}</>;
};
