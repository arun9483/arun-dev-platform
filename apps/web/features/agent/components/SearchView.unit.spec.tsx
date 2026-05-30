import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchView } from './SearchView';
import type { SearchDocument } from '@/lib/search/types';
import type { SearchResult } from '../types';

vi.mock('../hooks/useSearch', () => ({
  useSearch: vi.fn(),
}));

import { useSearch } from '../hooks/useSearch';

const mockSetQuery = vi.fn();

const defaultHookState = {
  query: '',
  setQuery: mockSetQuery,
  results: [] as SearchResult[],
  isIndexing: false,
};

const mockResult: SearchResult = {
  id: 'platform-rebuild',
  type: 'project',
  href: '/projects/platform-rebuild',
  title: 'Platform Rebuild',
  description: 'Rebuilt the platform.',
  tags: 'web performance',
  score: 1.8,
};

const docs: SearchDocument[] = [];

describe('SearchView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearch).mockReturnValue(defaultHookState);
  });

  it('renders the page heading', () => {
    render(<SearchView documents={docs} />);
    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<SearchView documents={docs} />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('passes documents to useSearch', () => {
    render(<SearchView documents={docs} />);
    expect(vi.mocked(useSearch)).toHaveBeenCalledWith(docs);
  });

  it('disables input while indexing', () => {
    vi.mocked(useSearch).mockReturnValue({ ...defaultHookState, isIndexing: true });
    render(<SearchView documents={docs} />);
    expect(screen.getByRole('searchbox')).toBeDisabled();
  });

  it('calls setQuery when user types', () => {
    render(<SearchView documents={docs} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'react' } });
    expect(mockSetQuery).toHaveBeenCalledWith('react');
  });

  it('shows result count when query is set and results exist', () => {
    vi.mocked(useSearch).mockReturnValue({
      ...defaultHookState,
      query: 'react',
      results: [mockResult],
    });
    render(<SearchView documents={docs} />);
    expect(screen.getByText(/1 result for/)).toBeInTheDocument();
  });

  it('uses plural "results" for multiple results', () => {
    vi.mocked(useSearch).mockReturnValue({
      ...defaultHookState,
      query: 'react',
      results: [mockResult, { ...mockResult, id: 'other' }],
    });
    render(<SearchView documents={docs} />);
    expect(screen.getByText(/2 results for/)).toBeInTheDocument();
  });

  it('shows result cards when results exist', () => {
    vi.mocked(useSearch).mockReturnValue({
      ...defaultHookState,
      query: 'react',
      results: [mockResult],
    });
    render(<SearchView documents={docs} />);
    expect(screen.getByText('Platform Rebuild')).toBeInTheDocument();
  });

  it('shows no-results message when query has no matches', () => {
    vi.mocked(useSearch).mockReturnValue({
      ...defaultHookState,
      query: 'xyznotfound',
      results: [],
    });
    render(<SearchView documents={docs} />);
    expect(screen.getByText(/No results found for/)).toBeInTheDocument();
  });

  it('does not show result count or no-results message when query is empty', () => {
    render(<SearchView documents={docs} />);
    expect(screen.queryByText(/result/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No results found/)).not.toBeInTheDocument();
  });

  it('does not show no-results message while indexing', () => {
    vi.mocked(useSearch).mockReturnValue({
      ...defaultHookState,
      query: 'something',
      results: [],
      isIndexing: true,
    });
    render(<SearchView documents={docs} />);
    expect(screen.queryByText(/No results found/)).not.toBeInTheDocument();
  });
});
