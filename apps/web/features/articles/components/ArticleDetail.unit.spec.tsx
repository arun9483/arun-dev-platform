import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx">{source}</div>,
}));

import { ArticleDetail } from './ArticleDetail';
import type { Article } from '../types';

const baseArticle: Article = {
  id: 'a1',
  slug: 'a1',
  title: 'RSC Deep Dive',
  summary: 'A summary.',
  publishedAt: '2026-03-15T00:00:00Z',
  createdAt: '2026-03-15T00:00:00Z',
  updatedAt: '2026-03-15T00:00:00Z',
  content: '# Hello\nbody',
  coverImage: '/cover.png',
  metadata: {
    tags: ['react', 'performance'],
    category: 'frontend',
    difficulty: 'advanced',
    readTime: 12,
    featured: true,
  },
};

describe('ArticleDetail', () => {
  it('renders the title, summary, and tags', () => {
    render(<ArticleDetail article={baseArticle} />);
    expect(screen.getByRole('heading', { name: 'RSC Deep Dive' })).toBeInTheDocument();
    expect(screen.getByText('A summary.')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('performance')).toBeInTheDocument();
  });

  it('formats the publishedAt date and displays read time', () => {
    render(<ArticleDetail article={baseArticle} />);
    expect(screen.getByText(/March 15, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/12 min read/)).toBeInTheDocument();
  });

  it('renders the difficulty label from the known map', () => {
    render(<ArticleDetail article={baseArticle} />);
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('falls back to the raw difficulty value when not in the label map', () => {
    render(
      <ArticleDetail
        article={{
          ...baseArticle,
          metadata: { ...baseArticle.metadata, difficulty: 'expert' as 'beginner' },
        }}
      />,
    );
    expect(screen.getByText('expert')).toBeInTheDocument();
  });

  it('renders the cover when coverImage is present', () => {
    render(<ArticleDetail article={baseArticle} />);
    expect(screen.getByRole('img', { name: /Cover image for RSC Deep Dive/ })).toBeInTheDocument();
  });

  it('omits the cover when coverImage is undefined', () => {
    render(<ArticleDetail article={{ ...baseArticle, coverImage: undefined }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the MDX body through the mocked MDXRemote', () => {
    render(<ArticleDetail article={baseArticle} />);
    expect(screen.getByTestId('mdx').textContent).toContain('Hello');
  });

  it('renders the back link to /articles', () => {
    render(<ArticleDetail article={baseArticle} />);
    expect(screen.getByRole('link', { name: /Back to articles/ })).toHaveAttribute(
      'href',
      '/articles',
    );
  });
});
