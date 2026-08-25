import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkillList } from './SkillList';
import type { Skill } from '../types';

const skills: Skill[] = [
  { name: 'React', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
];

describe('SkillList', () => {
  it('renders every skill', () => {
    render(<SkillList skills={skills} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders each skill as a list item carrying the accent chip classes', () => {
    render(<SkillList skills={skills} />);
    const item = screen.getByText('React');
    // Chip's render prop keeps the <li> semantics the list needs while supplying
    // the design-system classes, so the markup matches the hand-written version
    // this replaced.
    expect(item.tagName).toBe('LI');
    expect(item).toHaveClass('chip', 'chip-accent');
    expect(item.parentElement?.tagName).toBe('UL');
  });

  it('renders the optional title', () => {
    render(<SkillList skills={skills} title="Core" />);
    expect(screen.getByText('Core')).toHaveClass('type-overline');
  });
});
