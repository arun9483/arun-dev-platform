import { describe, it, expect, vi } from 'vitest';
import { loadProjectSlugs, loadProjectDetail } from './page.loader';
import type { Project } from '@/features/projects/types';

const mockProject: Project = {
  id: 'proj-a',
  slug: 'proj-a',
  createdAt: '',
  updatedAt: '',
  title: 'Project A',
  description: 'Desc',
  problem: 'P',
  solution: 'S',
  techStack: ['React'],
  impact: [{ label: 'Perf', value: '50%' }],
  links: { github: 'https://github.com/a' },
  metadata: { tags: ['frontend'], featured: true },
};

const mockDeps = {
  projectsService: {
    getAll: vi.fn(),
    getBySlug: vi.fn().mockResolvedValue(mockProject),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn().mockResolvedValue(['proj-a', 'proj-b']),
    getSearchDocuments: vi.fn(),
  },
};

describe('loadProjectSlugs', () => {
  it('returns all slugs', async () => {
    const slugs = await loadProjectSlugs(mockDeps);
    expect(slugs).toEqual(['proj-a', 'proj-b']);
    expect(mockDeps.projectsService.getAllSlugs).toHaveBeenCalledOnce();
  });
});

describe('loadProjectDetail', () => {
  it('returns project data for a valid slug', async () => {
    const data = await loadProjectDetail('proj-a', mockDeps);
    if (!data) throw new Error('Expected data to not be null');
    expect(data.project.title).toBe('Project A');
  });

  it('exercises the default deps factory when called with no deps (smoke test)', async () => {
    const slugs = await loadProjectSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    const slug = slugs.at(0);
    if (slug !== undefined) {
      const data = await loadProjectDetail(slug);
      expect(data).not.toBeNull();
    }
  });

  it('returns null for an unknown slug', async () => {
    const deps = {
      projectsService: { ...mockDeps.projectsService, getBySlug: vi.fn().mockResolvedValue(null) },
    };
    const data = await loadProjectDetail('unknown', deps);
    expect(data).toBeNull();
  });

  it('calls getBySlug with the correct slug', async () => {
    await loadProjectDetail('proj-a', mockDeps);
    expect(mockDeps.projectsService.getBySlug).toHaveBeenCalledWith('proj-a');
  });
});
