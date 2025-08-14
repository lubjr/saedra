'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultContent from './ResultContent';

export default function ResultContentPage() {
  const searchParams = useSearchParams();
  const filename = searchParams.get("filename");
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filename) {
      setError("No files specified");
      setLoading(false);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchResult = async () => {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:3002/analysis-result/${filename}`);
          if (!res.ok) throw new Error("Error when searching for result");
          const text = await res.text();

          if (text && text.trim() !== "") {
            setData(text);
            setLoading(false);
            clearInterval(intervalId);
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
          clearInterval(intervalId);
        }
      }, 2000);
    };

    fetchResult();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [filename]);

  if (error) return <p className="text-center">{error}</p>;
  if (loading) return <p className="text-center">Loading...</p>;

  return <ResultContent data={data || ""} />;
}