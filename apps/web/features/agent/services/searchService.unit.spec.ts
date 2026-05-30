import { describe, it, expect, vi } from 'vitest';
import {
  createSearchIndex,
  createSearchService,
  search,
  type ContentSource,
} from './searchService';
import type { SearchDocument } from '@/lib/search/types';

const projectDoc: SearchDocument = {
  id: 'platform-rebuild',
  type: 'project',
  href: '/projects/platform-rebuild',
  title: 'Platform Rebuild',
  description: 'Rebuilt the core platform with microservices.',
  tags: 'web performance',
  techStack: 'React TypeScript Node.js',
};

const articleDoc: SearchDocument = {
  id: 'react-server-components',
  type: 'article',
  href: '/articles/react-server-components',
  title: 'React Server Components Deep Dive',
  description: 'A deep dive into React Server Components.',
  tags: 'react performance',
};

describe('createSearchService', () => {
  it('flattens documents from all content sources concurrently', async () => {
    const sourceA: ContentSource = {
      getSearchDocuments: vi.fn(async () => [projectDoc]),
    };
    const sourceB: ContentSource = {
      getSearchDocuments: vi.fn(async () => [articleDoc]),
    };

    const service = createSearchService([sourceA, sourceB]);
    const docs = await service.getDocuments();

    expect(sourceA.getSearchDocuments).toHaveBeenCalledWith();
    expect(sourceB.getSearchDocuments).toHaveBeenCalledWith();
    expect(docs).toHaveLength(2);
    expect(docs.map((d) => d.id)).toEqual(['platform-rebuild', 'react-server-components']);
  });

  it('returns an empty array when given no sources', async () => {
    const service = createSearchService([]);
    expect(await service.getDocuments()).toEqual([]);
  });
});

describe('createSearchIndex + search', () => {
  const documents = [projectDoc, articleDoc];
  const index = createSearchIndex(documents);

  it('matches by title', () => {
    const results = search(index, 'platform');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('platform-rebuild');
  });

  it('matches by tag', () => {
    const results = search(index, 'performance');
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('supports prefix search', () => {
    const results = search(index, 'perform');
    expect(results.length).toBeGreaterThan(0);
  });

  it('attaches a numeric score and href to each result', () => {
    const results = search(index, 'react');
    expect(results.length).toBeGreaterThan(0);
    expect(typeof results[0].score).toBe('number');
    expect(results[0].href).toMatch(/^\/(projects|articles)\//);
  });

  it('returns empty array for empty query', () => {
    expect(search(index, '')).toEqual([]);
  });

  it('returns empty array for whitespace-only query', () => {
    expect(search(index, '   ')).toEqual([]);
  });
});
