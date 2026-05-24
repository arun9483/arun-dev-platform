'use client';

import { useState, useEffect, useMemo } from 'react';
import { createSearchIndex, search } from '@/lib/search/searchIndex';
import type { SearchDocument, SearchResult } from '@/lib/search/searchIndex';
import type MiniSearch from 'minisearch';

export type UseSearchResult = {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isIndexing: boolean;
};

export function useSearch(documents: SearchDocument[]): UseSearchResult {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<MiniSearch<SearchDocument> | null>(null);
  const [isIndexing, setIsIndexing] = useState(true);

  useEffect(() => {
    setIndex(createSearchIndex(documents));
    setIsIndexing(false);
    // documents identity changes only when the caller re-passes a new array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents.length]);

  const results = useMemo(() => {
    if (!index || !query.trim()) return [];
    return search(index, query);
  }, [index, query]);

  return { query, setQuery, results, isIndexing };
}
