import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useArticles } from './useArticles';
import { articlesService } from '../services/articlesService';
import type { ArticleMeta } from '../types';

vi.mock('../services/articlesService', () => ({
  articlesService: {
    getAll: vi.fn(),
    getBySlug: vi.fn(),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn(),
  },
}));

const mockArticle: ArticleMeta = {
  id: 'ar1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  slug: 'react-server-components',
  title: 'React Server Components Deep Dive',
  summary: 'A deep dive into RSC.',
  publishedAt: '2024-03-01T00:00:00Z',
  metadata: {
    tags: ['react', 'performance'],
    category: 'frontend',
    difficulty: 'advanced',
    readTime: 12,
    featured: true,
  },
};

const mockArticle2: ArticleMeta = {
  id: 'ar2',
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
  slug: 'css-grid-basics',
  title: 'CSS Grid Basics',
  summary: 'Getting started with CSS Grid.',
  publishedAt: '2024-01-01T00:00:00Z',
  metadata: {
    tags: ['css', 'layout'],
    category: 'frontend',
    difficulty: 'beginner',
    readTime: 5,
    featured: false,
  },
};

describe('useArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state', () => {
    vi.mocked(articlesService.getAll).mockResolvedValue([]);
    const { result } = renderHook(() => useArticles());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.articles).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loads articles and clears loading state', async () => {
    vi.mocked(articlesService.getAll).mockResolvedValue([mockArticle]);
    const { result } = renderHook(() => useArticles());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.articles).toEqual([mockArticle]);
    expect(result.current.error).toBeNull();
  });

  it('passes tag filter to service', async () => {
    vi.mocked(articlesService.getAll).mockResolvedValue([mockArticle]);
    const { result } = renderHook(() => useArticles({ tag: 'react' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(articlesService.getAll)).toHaveBeenCalledWith({
      tag: 'react',
      category: undefined,
      difficulty: undefined,
      featured: undefined,
    });
  });

  it('passes category filter to service', async () => {
    vi.mocked(articlesService.getAll).mockResolvedValue([mockArticle]);
    const { result } = renderHook(() => useArticles({ category: 'frontend' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(articlesService.getAll)).toHaveBeenCalledWith({
      tag: undefined,
      category: 'frontend',
      difficulty: undefined,
      featured: undefined,
    });
  });

  it('passes difficulty filter to service', async () => {
    vi.mocked(articlesService.getAll).mockResolvedValue([mockArticle]);
    const { result } = renderHook(() => useArticles({ difficulty: 'advanced' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(articlesService.getAll)).toHaveBeenCalledWith({
      tag: undefined,
      category: undefined,
      difficulty: 'advanced',
      featured: undefined,
    });
  });

  it('passes featured filter to service', async () => {
    vi.mocked(articlesService.getAll).mockResolvedValue([mockArticle]);
    const { result } = renderHook(() => useArticles({ featured: true }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(articlesService.getAll)).toHaveBeenCalledWith({
      tag: undefined,
      category: undefined,
      difficulty: undefined,
      featured: true,
    });
  });

  it('re-fetches when filter changes', async () => {
    vi.mocked(articlesService.getAll).mockResolvedValue([mockArticle]);
    const { rerender } = renderHook(
      ({ difficulty }: { difficulty?: 'beginner' | 'intermediate' | 'advanced' }) =>
        useArticles({ difficulty }),
      { initialProps: { difficulty: 'advanced' as const } },
    );
    await waitFor(() =>
      expect(vi.mocked(articlesService.getAll)).toHaveBeenCalledWith({
        tag: undefined,
        category: undefined,
        difficulty: 'advanced',
        featured: undefined,
      }),
    );
    vi.mocked(articlesService.getAll).mockResolvedValue([mockArticle2]);
    rerender({ difficulty: 'beginner' });
    await waitFor(() =>
      expect(vi.mocked(articlesService.getAll)).toHaveBeenCalledWith({
        tag: undefined,
        category: undefined,
        difficulty: 'beginner',
        featured: undefined,
      }),
    );
  });

  it('sets error when service rejects', async () => {
    vi.mocked(articlesService.getAll).mockRejectedValue(new Error('Service error'));
    const { result } = renderHook(() => useArticles());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Service error'));
    expect(result.current.articles).toEqual([]);
  });

  it('wraps non-Error rejections in an Error', async () => {
    vi.mocked(articlesService.getAll).mockRejectedValue(42);
    const { result } = renderHook(() => useArticles());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Failed to load articles'));
  });

  it('does not update state after unmount', async () => {
    let resolve!: (v: ArticleMeta[]) => void;
    vi.mocked(articlesService.getAll).mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );
    const { result, unmount } = renderHook(() => useArticles());
    unmount();
    resolve([mockArticle]);
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.articles).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });
});
