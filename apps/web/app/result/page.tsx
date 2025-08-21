import * as React from "react";

import { Loading } from "../../components/Loading";
import ResultContentPage from "../../components/ResultContentPage";

export default function Page() {
  return (
    <React.Suspense fallback={<Loading />}>
      <ResultContentPage />
    </React.Suspense>
  );
}
