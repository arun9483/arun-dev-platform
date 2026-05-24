import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadProjectsPage } from './page.loader';
import type { Project } from '@/features/projects/types';

const mockProject: Project = {
  id: 'proj-1',
  slug: 'proj-1',
  createdAt: '',
  updatedAt: '',
  title: 'Project One',
  description: 'Desc',
  problem: 'P',
  solution: 'S',
  techStack: ['React'],
  impact: [],
  links: {},
  metadata: { tags: [] },
};

const mockDeps = {
  projectsService: {
    getAll: vi.fn().mockResolvedValue([mockProject]),
    getBySlug: vi.fn(),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn(),
  },
};

describe('loadProjectsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns all projects', async () => {
    const data = await loadProjectsPage(mockDeps);
    expect(data.projects).toHaveLength(1);
    expect(data.projects[0].id).toBe('proj-1');
  });

  it('calls getAll exactly once', async () => {
    await loadProjectsPage(mockDeps);
    expect(mockDeps.projectsService.getAll).toHaveBeenCalledOnce();
  });
});
