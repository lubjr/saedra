"use client";

import { useSearchParams } from "next/navigation";

export default function ResultContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const language = searchParams.get("lang") || "Terraform";

  return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Analysis Result</h1>
      <pre className="bg-zinc-800 p-4 rounded text-left overflow-auto">{code}</pre>
      <p className="mt-4">Language: {language}</p>
    </div>
  );
}