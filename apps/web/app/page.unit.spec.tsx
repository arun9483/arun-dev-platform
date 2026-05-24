import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the profile name heading', async () => {
    render(await HomePage());
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Arun Tripathi');
  });

  it('renders the experience section', async () => {
    render(await HomePage());
    expect(screen.getByRole('heading', { name: /experience/i })).toBeInTheDocument();
  });

  it('renders the featured projects section', async () => {
    render(await HomePage());
    expect(screen.getByRole('heading', { name: /featured projects/i })).toBeInTheDocument();
  });

  it('renders the latest articles section', async () => {
    render(await HomePage());
    expect(screen.getByRole('heading', { name: /latest articles/i })).toBeInTheDocument();
  });

  it('renders the achievements section', async () => {
    render(await HomePage());
    expect(screen.getByRole('heading', { name: /achievements/i })).toBeInTheDocument();
  });
});
