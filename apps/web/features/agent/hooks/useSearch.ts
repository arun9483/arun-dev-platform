'use client';

import { useState, useEffect, useMemo } from 'react';
import type { SearchIndex } from '../services/searchService';
import type { SearchResult } from '../types';
import type { SearchDocument } from '@/lib/search/types';

export type UseSearchResult = {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isIndexing: boolean;
};

type SearchEngine = {
  index: SearchIndex;
  search: (index: SearchIndex, query: string) => SearchResult[];
};

export function useSearch(documents: SearchDocument[]): UseSearchResult {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState<SearchEngine | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Load minisearch and build the index off the critical path: right after
    // hydration the main thread must stay free for the font-swap repaint that
    // sets LCP, so the service chunk loads and indexes during idle time.
    const buildIndex = () => {
      void import('../services/searchService').then(({ createSearchIndex, search }) => {
        if (cancelled) return;
        setEngine({ index: createSearchIndex(documents), search });
      });
    };

    const idleHandle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(buildIndex, { timeout: 2000 })
        : window.setTimeout(buildIndex, 1);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
    };
    // documents identity changes only when the caller re-passes a new array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents.length]);

  const results = useMemo(() => {
    if (!engine || !query.trim()) return [];
    return engine.search(engine.index, query);
  }, [engine, query]);

  return { query, setQuery, results, isIndexing: engine === null };
}
