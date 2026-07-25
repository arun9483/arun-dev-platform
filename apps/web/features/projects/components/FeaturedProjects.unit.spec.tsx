import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeaturedProjects } from './FeaturedProjects';
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
  // Featured projects on the home page carry impact metrics and the featured
  // flag — the shape that exercises ProjectCard's optional sections.
  impact: [{ label: 'Latency', value: '-40%' }],
  links: {},
  metadata: { tags: ['web'], featured: true },
};

describe('FeaturedProjects', () => {
  it('renders the list once the deferred promise resolves', async () => {
    render(await FeaturedProjects({ projects: Promise.resolve([mockProject]) }));
    expect(screen.getByText('Project One')).toBeInTheDocument();
  });

  it('renders the impact metrics and featured chip of a featured project', async () => {
    render(await FeaturedProjects({ projects: Promise.resolve([mockProject]) }));
    expect(screen.getByText('-40%')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });
});
