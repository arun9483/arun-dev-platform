import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the platform heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Arun Dev Platform');
  });

  it('renders the tagline', () => {
    render(<HomePage />);
    expect(
      screen.getByText('Engineering excellence, technical depth, real-world impact.'),
    ).toBeInTheDocument();
  });

  it('renders a main landmark', () => {
    render(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
