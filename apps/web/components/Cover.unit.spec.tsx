import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Cover } from './Cover';

describe('Cover', () => {
  it('renders the image with the provided src and alt', () => {
    render(<Cover src="/cover.png" alt="Cover image for X" />);
    const img = screen.getByRole('img', { name: 'Cover image for X' });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('cover.png');
  });
});
