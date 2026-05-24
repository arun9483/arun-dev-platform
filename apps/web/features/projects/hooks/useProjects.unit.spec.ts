import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProjects } from './useProjects';
import { projectsService } from '../services/projectsService';
import type { Project } from '../types';

vi.mock('../services/projectsService', () => ({
  projectsService: {
    getAll: vi.fn(),
    getBySlug: vi.fn(),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn(),
  },
}));

const mockProject: Project = {
  id: 'p1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  slug: 'platform-rebuild',
  title: 'Platform Rebuild',
  description: 'A major platform rebuild.',
  problem: 'Legacy monolith.',
  solution: 'Microservices.',
  techStack: ['React', 'TypeScript', 'Node.js'],
  impact: [{ label: 'Latency', value: '-40%' }],
  links: { github: 'https://github.com/example/repo' },
  metadata: { tags: ['web', 'performance'], featured: true },
};

const mockProject2: Project = {
  id: 'p2',
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
  slug: 'design-system',
  title: 'Design System',
  description: 'Component library.',
  problem: 'Inconsistent UI.',
  solution: 'Unified tokens.',
  techStack: ['React', 'CSS'],
  impact: [],
  links: {},
  metadata: { tags: ['design'], featured: false },
};

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state', () => {
    vi.mocked(projectsService.getAll).mockResolvedValue([]);
    const { result } = renderHook(() => useProjects());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.projects).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loads projects and clears loading state', async () => {
    vi.mocked(projectsService.getAll).mockResolvedValue([mockProject]);
    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.projects).toEqual([mockProject]);
    expect(result.current.error).toBeNull();
  });

  it('passes tag filter to service', async () => {
    vi.mocked(projectsService.getAll).mockResolvedValue([mockProject]);
    const { result } = renderHook(() => useProjects({ tag: 'web' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(projectsService.getAll)).toHaveBeenCalledWith({
      tag: 'web',
      techStack: undefined,
      featured: undefined,
    });
  });

  it('passes techStack filter to service', async () => {
    vi.mocked(projectsService.getAll).mockResolvedValue([mockProject]);
    const { result } = renderHook(() => useProjects({ techStack: 'React' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(projectsService.getAll)).toHaveBeenCalledWith({
      tag: undefined,
      techStack: 'React',
      featured: undefined,
    });
  });

  it('passes featured filter to service', async () => {
    vi.mocked(projectsService.getAll).mockResolvedValue([mockProject]);
    const { result } = renderHook(() => useProjects({ featured: true }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(projectsService.getAll)).toHaveBeenCalledWith({
      tag: undefined,
      techStack: undefined,
      featured: true,
    });
  });

  it('re-fetches when filter changes', async () => {
    vi.mocked(projectsService.getAll).mockResolvedValue([mockProject]);
    const { rerender } = renderHook(({ tag }: { tag?: string }) => useProjects({ tag }), {
      initialProps: { tag: 'web' },
    });
    await waitFor(() =>
      expect(vi.mocked(projectsService.getAll)).toHaveBeenCalledWith({
        tag: 'web',
        techStack: undefined,
        featured: undefined,
      }),
    );
    vi.mocked(projectsService.getAll).mockResolvedValue([mockProject2]);
    rerender({ tag: 'design' });
    await waitFor(() =>
      expect(vi.mocked(projectsService.getAll)).toHaveBeenCalledWith({
        tag: 'design',
        techStack: undefined,
        featured: undefined,
      }),
    );
  });

  it('sets error when service rejects', async () => {
    vi.mocked(projectsService.getAll).mockRejectedValue(new Error('Fetch failed'));
    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Fetch failed'));
    expect(result.current.projects).toEqual([]);
  });

  it('wraps non-Error rejections in an Error', async () => {
    vi.mocked(projectsService.getAll).mockRejectedValue('unknown');
    const { result } = renderHook(() => useProjects());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Failed to load projects'));
  });

  it('does not update state after unmount', async () => {
    let resolve!: (v: Project[]) => void;
    vi.mocked(projectsService.getAll).mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );
    const { result, unmount } = renderHook(() => useProjects());
    unmount();
    resolve([mockProject]);
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.projects).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });
});
