import { describe, it, expect, vi } from 'vitest';
import { loadArticleSlugs, loadArticleDetail } from './page.loader';
import type { Article } from '@/features/articles/types';

const mockArticle: Article = {
  id: 'art-a',
  slug: 'art-a',
  title: 'Article A',
  summary: 'Summary A',
  publishedAt: '2026-05-01T00:00:00Z',
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
  content: '# Article A\n\nContent here.',
  metadata: {
    tags: ['react'],
    category: 'frontend',
    difficulty: 'advanced',
    readTime: 8,
    featured: true,
  },
};

const mockDeps = {
  articlesService: {
    getAll: vi.fn(),
    getBySlug: vi.fn().mockResolvedValue(mockArticle),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn().mockResolvedValue(['art-a', 'art-b']),
    getSearchDocuments: vi.fn(),
  },
};

describe('loadArticleSlugs', () => {
  it('returns all slugs', async () => {
    const slugs = await loadArticleSlugs(mockDeps);
    expect(slugs).toEqual(['art-a', 'art-b']);
    expect(mockDeps.articlesService.getAllSlugs).toHaveBeenCalledOnce();
  });
});

describe('loadArticleDetail', () => {
  it('returns article data for a valid slug', async () => {
    const data = await loadArticleDetail('art-a', mockDeps);
    if (!data) throw new Error('Expected data to not be null');
    expect(data.article.title).toBe('Article A');
    expect(data.article.content).toContain('Content here');
  });

  it('returns null for an unknown slug', async () => {
    const deps = {
      articlesService: { ...mockDeps.articlesService, getBySlug: vi.fn().mockResolvedValue(null) },
    };
    const data = await loadArticleDetail('unknown', deps);
    expect(data).toBeNull();
  });

  it('calls getBySlug with the correct slug', async () => {
    await loadArticleDetail('art-a', mockDeps);
    expect(mockDeps.articlesService.getBySlug).toHaveBeenCalledWith('art-a');
  });

  it('exercises the default deps factory when called with no deps (smoke test)', async () => {
    const slugs = await loadArticleSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    const slug = slugs.at(0);
    if (slug !== undefined) {
      const data = await loadArticleDetail(slug);
      expect(data).not.toBeNull();
    }
  });
});
