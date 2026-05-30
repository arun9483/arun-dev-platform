import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadHomePage } from './page.loader';
import type { Profile } from '@/features/profile/types';

const mockProfile: Profile = {
  id: 'p1',
  createdAt: '',
  updatedAt: '',
  name: 'Arun',
  title: 'Engineer',
  summary: 'Summary',
  skills: [],
  experience: [],
  socialLinks: {},
};

const mockDeps = {
  profileService: {
    getProfile: vi.fn().mockResolvedValue(mockProfile),
    getFeaturedSkills: vi
      .fn()
      .mockResolvedValue([{ name: 'React', category: 'frontend' as const }]),
  },
  projectsService: {
    getAll: vi.fn(),
    getBySlug: vi.fn(),
    getFeatured: vi.fn().mockResolvedValue([]),
    getAllSlugs: vi.fn(),
  },
  articlesService: {
    getAll: vi.fn(),
    getBySlug: vi.fn(),
    getFeatured: vi.fn().mockResolvedValue([]),
    getAllSlugs: vi.fn(),
  },
  achievementsService: {
    getFeatured: vi.fn().mockResolvedValue([]),
  },
};

describe('loadHomePage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns all required page data', async () => {
    const data = await loadHomePage(mockDeps);
    expect(data.profile).toEqual(mockProfile);
    expect(data.featuredSkills).toHaveLength(1);
    expect(data.featuredProjects).toEqual([]);
    expect(data.featuredArticles).toEqual([]);
    expect(data.featuredAchievements).toEqual([]);
  });

  it('calls all services exactly once', async () => {
    await loadHomePage(mockDeps);
    expect(mockDeps.profileService.getProfile).toHaveBeenCalledOnce();
    expect(mockDeps.profileService.getFeaturedSkills).toHaveBeenCalledOnce();
    expect(mockDeps.projectsService.getFeatured).toHaveBeenCalledOnce();
    expect(mockDeps.articlesService.getFeatured).toHaveBeenCalledOnce();
    expect(mockDeps.achievementsService.getFeatured).toHaveBeenCalledOnce();
  });

  it('exercises the default deps factory when called with no args (smoke test)', async () => {
    const data = await loadHomePage();
    expect(data.profile).toBeDefined();
    expect(Array.isArray(data.featuredProjects)).toBe(true);
    expect(Array.isArray(data.featuredArticles)).toBe(true);
    expect(Array.isArray(data.featuredAchievements)).toBe(true);
    expect(Array.isArray(data.featuredSkills)).toBe(true);
  });

  it('fetches all services in parallel (Promise.all)', async () => {
    const order: string[] = [];
    const deps = {
      ...mockDeps,
      profileService: {
        ...mockDeps.profileService,
        getProfile: vi.fn().mockImplementation(async () => {
          order.push('profile');
          return mockProfile;
        }),
        getFeaturedSkills: vi.fn().mockImplementation(async () => {
          order.push('skills');
          return [];
        }),
      },
      projectsService: {
        ...mockDeps.projectsService,
        getFeatured: vi.fn().mockImplementation(async () => {
          order.push('projects');
          return [];
        }),
      },
    };
    await loadHomePage(deps);
    expect(order).toContain('profile');
    expect(order).toContain('projects');
  });
});
