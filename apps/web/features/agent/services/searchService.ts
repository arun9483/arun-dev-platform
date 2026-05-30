import MiniSearch from 'minisearch';
import type { SearchDocument } from '@/lib/search/types';
import type { SearchResult } from '../types';

export type ContentSource = {
  getSearchDocuments: () => Promise<SearchDocument[]>;
};

export type SearchService = {
  getDocuments: () => Promise<SearchDocument[]>;
};

export function createSearchService(sources: ContentSource[]): SearchService {
  return {
    getDocuments: async () => {
      const groups = await Promise.all(sources.map((s) => s.getSearchDocuments()));
      return groups.flat();
    },
  };
}

export type SearchIndex = MiniSearch<SearchDocument>;

export function createSearchIndex(documents: SearchDocument[]): SearchIndex {
  const index = new MiniSearch<SearchDocument>({
    fields: ['title', 'description', 'tags', 'techStack'],
    storeFields: ['id', 'type', 'href', 'title', 'description', 'tags', 'techStack'],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
  index.addAll(documents);
  return index;
}

export function search(index: SearchIndex, query: string): SearchResult[] {
  if (!query.trim()) return [];
  return index.search(query).map((r) => ({
    id: r.id as string,
    type: r.type as string,
    href: r.href as string,
    title: r.title as string,
    description: r.description as string,
    tags: r.tags as string,
    techStack: r.techStack as string | undefined,
    score: r.score,
  }));
}
