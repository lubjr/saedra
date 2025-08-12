"use client";

import React, { Suspense } from "react";
import ResultContent from "../../components/ResultContent";

export default function ResultPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResultContent />
    </Suspense>
  );
}