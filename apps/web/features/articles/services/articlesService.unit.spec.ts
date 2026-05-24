import { describe, it, expect } from 'vitest';
import { createArticlesService } from './articlesService';
import type { ArticlesRepository } from '../repositories/articlesRepository';
import type { ArticleMeta } from '../types';

const mockArticles: ArticleMeta[] = [
  {
    id: 'article-a',
    slug: 'article-a',
    title: 'Article A',
    summary: 'Summary A',
    publishedAt: '2026-05-01T00:00:00Z',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
    metadata: {
      tags: ['react', 'performance'],
      category: 'frontend',
      difficulty: 'advanced',
      readTime: 10,
      featured: true,
    },
  },
  {
    id: 'article-b',
    slug: 'article-b',
    title: 'Article B',
    summary: 'Summary B',
    publishedAt: '2026-03-01T00:00:00Z',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    metadata: {
      tags: ['node', 'backend'],
      category: 'backend',
      difficulty: 'beginner',
      readTime: 5,
      featured: false,
    },
  },
  {
    id: 'article-c',
    slug: 'article-c',
    title: 'Article C',
    summary: 'Summary C',
    publishedAt: '2026-04-15T00:00:00Z',
    createdAt: '2026-04-15T00:00:00Z',
    updatedAt: '2026-04-15T00:00:00Z',
    metadata: {
      tags: ['react', 'typescript'],
      category: 'frontend',
      difficulty: 'intermediate',
      readTime: 7,
      featured: true,
    },
  },
];

const mockRepository: ArticlesRepository = {
  findAll: async () => mockArticles,
  findBySlug: async (slug) => {
    const found = mockArticles.find((a) => a.slug === slug);
    return found ? { ...found, content: `# ${found.title}` } : null;
  },
  findAllSlugs: async () => mockArticles.map((a) => a.slug),
};

describe('articlesService', () => {
  const service = createArticlesService(mockRepository);

  it('returns all articles sorted by date descending', async () => {
    const result = await service.getAll();
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('article-a');
    expect(result[1].id).toBe('article-c');
    expect(result[2].id).toBe('article-b');
  });

  it('filters by tag', async () => {
    const result = await service.getAll({ tag: 'react' });
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.metadata.tags.includes('react'))).toBe(true);
  });

  it('filters by category', async () => {
    const result = await service.getAll({ category: 'backend' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('article-b');
  });

  it('filters by difficulty', async () => {
    const result = await service.getAll({ difficulty: 'advanced' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('article-a');
  });

  it('filters by featured', async () => {
    const result = await service.getAll({ featured: true });
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.metadata.featured)).toBe(true);
  });

  it('returns article with content by slug', async () => {
    const result = await service.getBySlug('article-a');
    expect(result?.content).toBe('# Article A');
  });

  it('returns null for unknown slug', async () => {
    const result = await service.getBySlug('nonexistent');
    expect(result).toBeNull();
  });

  it('returns only featured articles sorted by date', async () => {
    const result = await service.getFeatured();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('article-a');
  });

  it('returns all slugs', async () => {
    const slugs = await service.getAllSlugs();
    expect(slugs).toEqual(['article-a', 'article-b', 'article-c']);
  });
});
