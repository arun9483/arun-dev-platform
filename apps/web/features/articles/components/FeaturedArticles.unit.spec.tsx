import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeaturedArticles } from './FeaturedArticles';
import type { ArticleMeta } from '../types';

const mockArticle: ArticleMeta = {
  id: 'a1',
  slug: 'a1',
  title: 'Article One',
  summary: 'Summary',
  publishedAt: '2026-01-01T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  metadata: {
    tags: ['react'],
    category: 'frontend',
    difficulty: 'beginner',
    readTime: 5,
    featured: true,
  },
};

describe('FeaturedArticles', () => {
  it('renders the list once the deferred promise resolves', async () => {
    render(await FeaturedArticles({ articles: Promise.resolve([mockArticle]) }));
    expect(screen.getByText('Article One')).toBeInTheDocument();
  });
});
