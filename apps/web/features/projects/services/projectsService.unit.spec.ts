import { describe, it, expect } from 'vitest';
import { createProjectsService } from './projectsService';
import type { ProjectsRepository } from '../repositories/projectsRepository';
import type { Project } from '../types';

const mockProjects: Project[] = [
  {
    id: 'project-a',
    slug: 'project-a',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    title: 'Project A',
    description: 'Desc A',
    problem: 'Problem A',
    solution: 'Solution A',
    techStack: ['React', 'TypeScript'],
    impact: [{ label: 'Perf', value: '50% faster' }],
    links: { github: 'https://github.com/a' },
    metadata: { tags: ['frontend', 'performance'], featured: true },
  },
  {
    id: 'project-b',
    slug: 'project-b',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    title: 'Project B',
    description: 'Desc B',
    problem: 'Problem B',
    solution: 'Solution B',
    techStack: ['Node.js', 'GraphQL'],
    impact: [],
    links: {},
    metadata: { tags: ['backend'], featured: false },
  },
];

const mockRepository: ProjectsRepository = {
  findAll: async () => mockProjects,
  findBySlug: async (slug) => mockProjects.find((p) => p.slug === slug) ?? null,
};

describe('projectsService', () => {
  const service = createProjectsService(mockRepository);

  it('returns all projects', async () => {
    const result = await service.getAll();
    expect(result).toHaveLength(2);
  });

  it('returns project by slug', async () => {
    const result = await service.getBySlug('project-b');
    expect(result?.title).toBe('Project B');
  });

  it('returns null for unknown slug', async () => {
    const result = await service.getBySlug('nonexistent');
    expect(result).toBeNull();
  });

  it('returns only featured projects', async () => {
    const result = await service.getFeatured();
    expect(result).toHaveLength(1);
    expect(result.at(0)?.metadata.featured).toBe(true);
  });

  it('returns all slugs', async () => {
    const slugs = await service.getAllSlugs();
    expect(slugs).toEqual(['project-a', 'project-b']);
  });

  it('returns search documents with project-shaped fields', async () => {
    const docs = await service.getSearchDocuments();
    expect(docs).toHaveLength(2);
    expect(docs[0]).toEqual({
      id: 'project-a',
      type: 'project',
      href: '/projects/project-a',
      title: 'Project A',
      description: 'Desc A',
      tags: 'frontend performance',
      techStack: 'React TypeScript',
    });
  });
});
