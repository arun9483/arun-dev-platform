import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectList } from './ProjectList';
import type { Project } from '../types';

const mockProject: Project = {
  id: 'p1',
  slug: 'p1',
  createdAt: '',
  updatedAt: '',
  title: 'Project One',
  description: 'A project.',
  problem: 'P',
  solution: 'S',
  techStack: ['React'],
  impact: [],
  links: {},
  metadata: { tags: ['web'], featured: false },
};

describe('ProjectList', () => {
  it('renders an empty-state message when the list is empty', () => {
    render(<ProjectList projects={[]} />);
    expect(screen.getByText('No projects found.')).toBeInTheDocument();
  });

  it('renders one card per project when the list is populated', () => {
    render(<ProjectList projects={[mockProject, { ...mockProject, id: 'p2', slug: 'p2' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
