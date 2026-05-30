import { describe, it, expect, vi } from 'vitest';
import { loadSearchPage } from './page.loader';
import type { SearchService } from '@/features/agent/services/searchService';
import type { SearchDocument } from '@/lib/search/types';

const mockDocuments: SearchDocument[] = [
  {
    id: 'platform-rebuild',
    type: 'project',
    href: '/projects/platform-rebuild',
    title: 'Platform Rebuild',
    description: 'Rebuilt the core platform with microservices.',
    tags: 'web performance',
    techStack: 'React TypeScript Node.js',
  },
  {
    id: 'react-server-components',
    type: 'article',
    href: '/articles/react-server-components',
    title: 'React Server Components Deep Dive',
    description: 'A deep dive into React Server Components.',
    tags: 'react performance',
  },
];

const mockDeps = {
  searchService: {
    getDocuments: vi.fn(async () => mockDocuments),
  } satisfies SearchService,
};

describe('loadSearchPage', () => {
  it('delegates to searchService.getDocuments and returns the documents', async () => {
    const data = await loadSearchPage(mockDeps);
    expect(mockDeps.searchService.getDocuments).toHaveBeenCalledWith();
    expect(data.documents).toEqual(mockDocuments);
  });

  it('exercises the default deps factory when called with no args (smoke test)', async () => {
    const data = await loadSearchPage();
    expect(Array.isArray(data.documents)).toBe(true);
  });
});
