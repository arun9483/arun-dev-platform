import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ArticleList } from './ArticleList';
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
    featured: false,
  },
};

describe('ArticleList', () => {
  it('renders an empty-state message when the list is empty', () => {
    render(<ArticleList articles={[]} />);
    expect(screen.getByText('No articles found.')).toBeInTheDocument();
  });

  it('renders one card per article when the list is populated', () => {
    render(<ArticleList articles={[mockArticle, { ...mockArticle, id: 'a2', slug: 'a2' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
