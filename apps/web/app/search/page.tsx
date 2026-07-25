import { Suspense } from 'react';
import { loadSearchPage } from './page.loader';
import { SearchView } from '@/features/agent/components/SearchView';

export const metadata = {
  title: 'Search',
  description: 'Search across projects and articles.',
};

export default async function SearchPage() {
  const { documents } = await loadSearchPage();
  return (
    // Own selective-hydration unit: the search island hydrates in short tasks
    // after paint instead of extending the page's main hydration task.
    <Suspense fallback={null}>
      <SearchView documents={documents} />
    </Suspense>
  );
}
