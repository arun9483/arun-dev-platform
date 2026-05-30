import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectDetail } from './ProjectDetail';
import type { Project } from '../types';

const baseProject: Project = {
  id: 'p1',
  slug: 'p1',
  createdAt: '',
  updatedAt: '',
  title: 'Platform Rebuild',
  description: 'Rebuilt the platform.',
  problem: 'Legacy monolith.',
  solution: 'Microservices.',
  techStack: ['React', 'TypeScript'],
  impact: [{ label: 'Latency', value: '-40%' }],
  links: { github: 'https://gh/x', live: 'https://live/x' },
  coverImage: '/cover.png',
  metadata: { tags: ['web'], featured: true },
};

describe('ProjectDetail', () => {
  it('renders title, description, problem, solution, and tech stack', () => {
    render(<ProjectDetail project={baseProject} />);
    expect(screen.getByRole('heading', { name: 'Platform Rebuild' })).toBeInTheDocument();
    expect(screen.getByText('Rebuilt the platform.')).toBeInTheDocument();
    expect(screen.getByText('Legacy monolith.')).toBeInTheDocument();
    expect(screen.getByText('Microservices.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders cover image when coverImage is provided', () => {
    render(<ProjectDetail project={baseProject} />);
    expect(
      screen.getByRole('img', { name: /Cover image for Platform Rebuild/ }),
    ).toBeInTheDocument();
  });

  it('omits the cover when coverImage is undefined', () => {
    render(<ProjectDetail project={{ ...baseProject, coverImage: undefined }} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders both GitHub and Live links when both are present', () => {
    render(<ProjectDetail project={baseProject} />);
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://gh/x');
    expect(screen.getByRole('link', { name: /Live site/ })).toHaveAttribute(
      'href',
      'https://live/x',
    );
  });

  it('omits the GitHub link when only live is present', () => {
    render(<ProjectDetail project={{ ...baseProject, links: { live: 'https://live/x' } }} />);
    expect(screen.queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Live site/ })).toBeInTheDocument();
  });

  it('omits the Live link when only github is present', () => {
    render(<ProjectDetail project={{ ...baseProject, links: { github: 'https://gh/x' } }} />);
    expect(screen.getByRole('link', { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Live site/ })).not.toBeInTheDocument();
  });

  it('omits the Impact section when impact is empty', () => {
    render(<ProjectDetail project={{ ...baseProject, impact: [] }} />);
    expect(screen.queryByText('Impact')).not.toBeInTheDocument();
  });

  it('renders the back link to /projects', () => {
    render(<ProjectDetail project={baseProject} />);
    const back = screen.getByRole('link', { name: /Back to projects/ });
    expect(back).toHaveAttribute('href', '/projects');
  });
});
