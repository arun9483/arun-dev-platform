import MiniSearch from 'minisearch';

export type SearchDocument = {
  id: string;
  type: 'project' | 'article';
  title: string;
  description: string;
  tags: string;
  techStack?: string;
};

export type SearchResult = SearchDocument & {
  score: number;
};

export function createSearchIndex(documents: SearchDocument[]): MiniSearch<SearchDocument> {
  const index = new MiniSearch<SearchDocument>({
    fields: ['title', 'description', 'tags', 'techStack'],
    storeFields: ['id', 'type', 'title', 'description', 'tags', 'techStack'],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
  index.addAll(documents);
  return index;
}

export function search(index: MiniSearch<SearchDocument>, query: string): SearchResult[] {
  if (!query.trim()) return [];
  return index.search(query).map((r) => ({
    id: r.id as string,
    type: r.type as 'project' | 'article',
    title: r.title as string,
    description: r.description as string,
    tags: r.tags as string,
    techStack: r.techStack as string | undefined,
    score: r.score,
  }));
}
