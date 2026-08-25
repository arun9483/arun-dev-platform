'use client';

import { Card, Chip } from '@arun-dev/ui';
import { useSearch } from '../hooks/useSearch';
import { SearchResultCard } from './SearchResultCard';
import type { SearchDocument } from '@/lib/search/types';
import styles from './SearchView.module.css';

type Props = {
  documents: SearchDocument[];
};

export function SearchView({ documents }: Props) {
  const { query, setQuery, results, isIndexing } = useSearch(documents);
  const trimmed = query.trim();

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1 className="text-size-3xl font-weight-bold type-display">Search</h1>
        <p className="text-size-base text-color-secondary">Search across projects and articles.</p>
      </div>

      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects and articles…"
          className={styles.input}
          aria-label="Search"
          disabled={isIndexing}
        />
      </form>

      {trimmed ? (
        <p className="text-size-xs text-color-muted" aria-live="polite">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{trimmed}&rdquo;
        </p>
      ) : (
        <div className={styles.emptyState} aria-hidden={isIndexing}>
          <div className={styles.suggestions}>
            <p className="text-size-xs font-weight-medium uppercase letter-spacing-wider text-color-muted">
              Try searching for
            </p>
            <div className={styles.suggestionChips}>
              {['Next.js', 'TypeScript', 'performance', 'design system', 'RSC'].map((term) => (
                <Chip
                  key={term}
                  render={<button type="button" />}
                  onClick={() => setQuery(term)}
                  className={styles.suggestionBtn}
                >
                  {term}
                </Chip>
              ))}
            </div>
          </div>

          <div className={styles.indexedContent}>
            <p className="text-size-xs font-weight-medium uppercase letter-spacing-wider text-color-muted">
              What&rsquo;s indexed
            </p>
            <div className={styles.indexedGrid}>
              {Object.entries(
                documents.reduce<Record<string, number>>((acc, d) => {
                  acc[d.type] = (acc[d.type] ?? 0) + 1;
                  return acc;
                }, {}),
              ).map(([type, count]) => (
                <Card key={type} className={styles.indexedCard}>
                  <span className="text-size-2xl font-weight-bold type-display">{count}</span>
                  <span className="text-size-xs text-color-muted capitalize">
                    {type}
                    {count !== 1 ? 's' : ''}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <ul className={styles.results} aria-label="Search results">
          {results.map((result) => (
            <li key={result.id}>
              <SearchResultCard result={result} />
            </li>
          ))}
        </ul>
      )}

      {trimmed && results.length === 0 && !isIndexing && (
        <p className="text-size-sm text-color-secondary">
          No results found for &ldquo;{trimmed}&rdquo;.
        </p>
      )}
    </div>
  );
}
