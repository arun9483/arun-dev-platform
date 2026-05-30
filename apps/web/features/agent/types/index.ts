import type { SearchDocument } from '@/lib/search/types';

export type SearchResult = SearchDocument & {
  score: number;
};
