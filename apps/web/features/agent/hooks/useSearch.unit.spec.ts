import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSearch } from './useSearch';
import type { SearchDocument } from '@/lib/search/types';

const docs: SearchDocument[] = [
  {
    id: 'p1',
    type: 'project',
    href: '/projects/p1',
    title: 'Platform Rebuild',
    description: 'Rebuilt the core platform with microservices.',
    tags: 'performance scalability',
    techStack: 'React TypeScript Node.js',
  },
  {
    id: 'ar1',
    type: 'article',
    href: '/articles/ar1',
    title: 'React Server Components',
    description: 'A deep dive into React Server Components and streaming.',
    tags: 'react performance frontend',
  },
  {
    id: 'ar2',
    type: 'article',
    href: '/articles/ar2',
    title: 'CSS Grid Layout',
    description: 'Getting started with CSS Grid for responsive layouts.',
    tags: 'css layout frontend',
  },
];

describe('useSearch', () => {
  it('completes indexing synchronously — isIndexing is false after mount', async () => {
    const { result } = renderHook(() => useSearch(docs));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
  });

  it('returns empty results before a query is set', async () => {
    const { result } = renderHook(() => useSearch(docs));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
  });

  it('returns empty results for whitespace-only query', async () => {
    const { result } = renderHook(() => useSearch(docs));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    act(() => result.current.setQuery('   '));
    expect(result.current.results).toEqual([]);
  });

  it('returns matching results for a query', async () => {
    const { result } = renderHook(() => useSearch(docs));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    act(() => result.current.setQuery('react'));
    await waitFor(() => expect(result.current.results.length).toBeGreaterThan(0));
    const ids = result.current.results.map((r) => r.id);
    expect(ids).toContain('ar1');
  });

  it('results include score field', async () => {
    const { result } = renderHook(() => useSearch(docs));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    act(() => result.current.setQuery('platform'));
    await waitFor(() => expect(result.current.results.length).toBeGreaterThan(0));
    expect(result.current.results.at(0)).toHaveProperty('score');
    expect(typeof result.current.results.at(0)?.score).toBe('number');
  });

  it('clears results when query is reset to empty', async () => {
    const { result } = renderHook(() => useSearch(docs));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    act(() => result.current.setQuery('css'));
    await waitFor(() => expect(result.current.results.length).toBeGreaterThan(0));
    act(() => result.current.setQuery(''));
    expect(result.current.results).toEqual([]);
  });

  it('re-indexes when documents length changes', async () => {
    const { result, rerender } = renderHook(({ d }: { d: SearchDocument[] }) => useSearch(d), {
      initialProps: { d: docs.slice(0, 1) },
    });
    await waitFor(() => expect(result.current.isIndexing).toBe(false));

    rerender({ d: docs });
    await waitFor(() => expect(result.current.isIndexing).toBe(false));

    act(() => result.current.setQuery('css'));
    await waitFor(() => expect(result.current.results.length).toBeGreaterThan(0));
    expect(result.current.results.map((r) => r.id)).toContain('ar2');
  });

  it('exposes setQuery to update the query string', async () => {
    const { result } = renderHook(() => useSearch(docs));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    act(() => result.current.setQuery('performance'));
    expect(result.current.query).toBe('performance');
  });

  it('works with an empty documents array', async () => {
    const { result } = renderHook(() => useSearch([]));
    await waitFor(() => expect(result.current.isIndexing).toBe(false));
    act(() => result.current.setQuery('anything'));
    expect(result.current.results).toEqual([]);
  });
});
