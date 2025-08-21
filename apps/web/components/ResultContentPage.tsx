"use client";

import {
  broker,
  codec,
  connectClient,
  Msg,
  Sub,
} from "@repo/nats-client/browser";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { Loading } from "./Loading";
import ResultContent from "./ResultContent";

export default function ResultContentPage() {
  const searchParams = useSearchParams();
  const filename = searchParams.get("filename");
  const requestId = searchParams.get("requestId");
  const [data, setData] = React.useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resources: any[];
    summary: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!filename || !requestId) {
      setError("Missing filename or requestId");
      setLoading(false);
      return;
    }

    let isMounted = true;
    let sub: Sub<Msg> | null = null;

    const fetchData = async () => {
      try {
        await connectClient();
        const replyTopic = `iac.analysis.result.${requestId}`;
        sub = broker.subscribe(replyTopic);

        for await (const msg of sub) {
          try {
            const decoded = JSON.parse(codec.decode(msg.data));
            if (decoded?.analysis && isMounted) {
              setData(decoded.analysis);
              break;
            } else if (decoded?.error && isMounted) {
              setError(decoded.error);
              break;
            }
          } catch (error_) {
            // eslint-disable-next-line no-console
            console.warn("Failed to decode message", error_);
          }
        }
      } catch (error_) {
        if (isMounted)
          setError(
            "Failed to fetch analysis result: " + (error_ as Error).message,
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (sub) sub.unsubscribe();
    };
  }, [filename, requestId]);

  if (error) return <p className="text-center">{error}</p>;
  if (loading) return <Loading />;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return <ResultContent data={data!} />;
}
