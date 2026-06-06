import { loadSearchPage } from './page.loader';
import { SearchView } from '@/features/agent/components/SearchView';

export const metadata = {
  title: 'Search',
  description: 'Search across projects and articles.',
};

export default async function SearchPage() {
  const { documents } = await loadSearchPage();
  return <SearchView documents={documents} />;
}
