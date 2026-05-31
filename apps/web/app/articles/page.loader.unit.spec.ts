import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadArticlesPage } from './page.loader';
import type { ArticleMeta } from '@/features/articles/types';

const mockArticle: ArticleMeta = {
  id: 'art-1',
  slug: 'art-1',
  title: 'Article One',
  summary: 'Summary',
  publishedAt: '2026-05-01T00:00:00Z',
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
  metadata: { tags: ['react'], category: 'frontend', difficulty: 'intermediate', readTime: 5 },
};

const mockDeps = {
  articlesService: {
    getAll: vi.fn().mockResolvedValue([mockArticle]),
    getBySlug: vi.fn(),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn(),
    getSearchDocuments: vi.fn(),
  },
};

describe('loadArticlesPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns all articles', async () => {
    const data = await loadArticlesPage(mockDeps);
    expect(data.articles).toHaveLength(1);
    expect(data.articles.at(0)?.id).toBe('art-1');
  });

  it('calls getAll exactly once', async () => {
    await loadArticlesPage(mockDeps);
    expect(mockDeps.articlesService.getAll).toHaveBeenCalledOnce();
  });

  it('exercises the default deps factory when called with no args (smoke test)', async () => {
    const data = await loadArticlesPage();
    expect(Array.isArray(data.articles)).toBe(true);
  });
});
