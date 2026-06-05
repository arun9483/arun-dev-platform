'use client';

import { useSearch } from '../hooks/useSearch';
import { SearchResultCard } from './SearchResultCard';
import type { SearchDocument } from '@/lib/search/types';

type Props = {
  documents: SearchDocument[];
};

export function SearchView({ documents }: Props) {
  const { query, setQuery, results, isIndexing } = useSearch(documents);
  const trimmed = query.trim();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-display">Search</h1>
        <p className="text-base text-secondary">Search across projects and articles.</p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects and articles…"
        className="w-full px-4 py-3 rounded-xl text-sm bg-surface text-primary placeholder:text-muted border-default focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]"
        aria-label="Search"
        disabled={isIndexing}
      />

      {trimmed && (
        <p className="text-xs text-muted" aria-live="polite">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{trimmed}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <ul className="space-y-4" aria-label="Search results">
          {results.map((result) => (
            <li key={result.id}>
              <SearchResultCard result={result} />
            </li>
          ))}
        </ul>
      )}

      {trimmed && results.length === 0 && !isIndexing && (
        <p className="text-sm text-secondary">No results found for &ldquo;{trimmed}&rdquo;.</p>
      )}
    </div>
  );
}
