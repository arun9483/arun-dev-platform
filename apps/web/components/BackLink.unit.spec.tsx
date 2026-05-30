import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BackLink } from './BackLink';

describe('BackLink', () => {
  it('renders an anchor with the provided href and children, prefixed with the back arrow', () => {
    render(<BackLink href="/projects">Back to projects</BackLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveTextContent('← Back to projects');
  });
});
