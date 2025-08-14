import * as React from "react";

import ResultContentPage from "../../components/ResultContentPage";

export default function Page() {
  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      <ResultContentPage />
    </React.Suspense>
  );
}
