import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TagChips } from './TagChips';

describe('TagChips', () => {
  it('renders one chip per tag with the default variant class', () => {
    render(<TagChips tags={['react', 'performance']} />);
    const chips = screen.getAllByText(/react|performance/);
    expect(chips).toHaveLength(2);
    chips.forEach((c) => expect(c.className).toContain('chip-default'));
  });

  it('applies the accent variant when requested', () => {
    render(<TagChips tags={['typescript']} variant="accent" />);
    expect(screen.getByText('typescript').className).toContain('chip-accent');
  });

  it('renders nothing inside the wrapper when tags is empty', () => {
    const { container } = render(<TagChips tags={[]} />);
    expect(container.querySelectorAll('span')).toHaveLength(0);
  });
});
