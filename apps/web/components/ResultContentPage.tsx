"use client";

import { Msg, Sub } from "@repo/nats-client/browser";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { useNats } from "../app/providers/NatsProvider";
import { Loading } from "./Loading";
import ResultContent from "./ResultContent";

export default function ResultContentPage() {
  const searchParams = useSearchParams();
  const payloadParam = searchParams.get("payload");
  const payload = payloadParam ? JSON.parse(payloadParam) : null;

  const [data, setData] = React.useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resources: any[];
    summary: string;
  } | null>(null);

  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const { broker, codec } = useNats();

  const publishedRef = React.useRef(false);

  React.useEffect(() => {
    if (!payload) {
      setError("Missing payload in URL");
      setLoading(false);
      return;
    }

    let isMounted = true;
    let sub: Sub<Msg> | null = null;

    const fetchData = async () => {
      try {
        const replyTopic = payload.replyTopic;
        sub = broker.subscribe(replyTopic);

        if (!publishedRef.current) {
          broker.publish(
            "iac.to.analyze",
            codec.encode(JSON.stringify(payload)),
          );
          publishedRef.current = true;
        }

        for await (const msg of sub) {
          if (!isMounted) break;

          try {
            const decoded = JSON.parse(codec.decode(msg.data));

            if (decoded?.analysis) {
              setData(decoded.analysis);
              setLoading(false);

              sub.unsubscribe();
              break;
            } else if (decoded?.error) {
              setError(decoded.error);
              setLoading(false);

              sub.unsubscribe();
              break;
            }
          } catch (error_) {
            // eslint-disable-next-line no-console
            console.warn("Failed to decode message", error_);
          }
        }
      } catch (error_) {
        if (isMounted) {
          setError(
            "Failed to fetch analysis result: " + (error_ as Error).message,
          );
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (sub) sub.unsubscribe();
    };
  }, [payload, broker, codec]);

  if (error) return <p className="text-center">{error}</p>;
  if (loading) return <Loading />;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return <ResultContent data={data!} />;
}
