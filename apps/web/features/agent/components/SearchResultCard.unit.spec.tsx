import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchResultCard } from './SearchResultCard';
import type { SearchResult } from '../types';

const projectResult: SearchResult = {
  id: 'platform-rebuild',
  type: 'project',
  href: '/projects/platform-rebuild',
  title: 'Platform Rebuild',
  description: 'Rebuilt the core platform with microservices.',
  tags: 'web performance scalability',
  techStack: 'React TypeScript',
  score: 2.1,
};

const articleResult: SearchResult = {
  id: 'react-server-components',
  type: 'article',
  href: '/articles/react-server-components',
  title: 'React Server Components',
  description: 'A deep dive into RSC and streaming.',
  tags: 'react frontend',
  score: 1.5,
};

const noTagsResult: SearchResult = {
  id: 'no-tags-project',
  type: 'project',
  href: '/projects/no-tags-project',
  title: 'No Tags',
  description: 'A project with no tags.',
  tags: '',
  score: 1.0,
};

const unknownTypeResult: SearchResult = {
  id: 'experiment-1',
  type: 'experiment',
  href: '/experiments/experiment-1',
  title: 'Custom Type Item',
  description: 'Fallback rendering for unknown content types.',
  tags: '',
  score: 0.5,
};

describe('SearchResultCard', () => {
  it('renders the result title', () => {
    render(<SearchResultCard result={projectResult} />);
    expect(screen.getByText('Platform Rebuild')).toBeInTheDocument();
  });

  it('renders the result description', () => {
    render(<SearchResultCard result={projectResult} />);
    expect(screen.getByText('Rebuilt the core platform with microservices.')).toBeInTheDocument();
  });

  it('links to /projects/[slug] for project type', () => {
    render(<SearchResultCard result={projectResult} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects/platform-rebuild');
  });

  it('links to /articles/[slug] for article type', () => {
    render(<SearchResultCard result={articleResult} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/articles/react-server-components');
  });

  it('shows "Project" type label for project results', () => {
    render(<SearchResultCard result={projectResult} />);
    expect(screen.getByText('Project')).toBeInTheDocument();
  });

  it('shows "Article" type label for article results', () => {
    render(<SearchResultCard result={articleResult} />);
    expect(screen.getByText('Article')).toBeInTheDocument();
  });

  it('applies chip-accent class for project type', () => {
    render(<SearchResultCard result={projectResult} />);
    const badge = screen.getByText('Project');
    expect(badge.className).toContain('chip-accent');
  });

  it('applies chip-default class for article type', () => {
    render(<SearchResultCard result={articleResult} />);
    const badge = screen.getByText('Article');
    expect(badge.className).toContain('chip-default');
  });

  it('renders tags prefixed with #', () => {
    render(<SearchResultCard result={projectResult} />);
    expect(screen.getByText('#web #performance #scalability')).toBeInTheDocument();
  });

  it('does not render tags section when tags is empty', () => {
    render(<SearchResultCard result={noTagsResult} />);
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
  });

  it('falls back to the raw type string when no TYPE_LABEL match exists', () => {
    render(<SearchResultCard result={unknownTypeResult} />);
    expect(screen.getByText('experiment')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/experiments/experiment-1');
  });
});
