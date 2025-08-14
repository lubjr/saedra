import { Suspense } from 'react';
import ResultContentPage from '../../components/ResultContentPage';

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResultContentPage />
    </Suspense>
  );
}