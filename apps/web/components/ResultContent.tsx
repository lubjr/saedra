"use client";

import React from "react";

export default function ResultContent({ data }: { data: string }) {
  let formattedData = data;

  try {
    const jsonObj = JSON.parse(data);
    formattedData = JSON.stringify(jsonObj, null, 2);
  } catch {
    formattedData = data;
  }

  return (
    <div className="max-w-3xl max-h-[500px] mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Analysis Result</h1>
      <pre className="bg-zinc-800 p-4 rounded text-left overflow-auto whitespace-pre-wrap">
        {formattedData}
      </pre>
    </div>
  );
}