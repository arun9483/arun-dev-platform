import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfile } from './useProfile';
import { profileService } from '../services/profileService';
import type { Profile, Skill } from '../types';

vi.mock('../services/profileService', () => ({
  profileService: {
    getProfile: vi.fn(),
    getSkillsByCategory: vi.fn(),
    getFeaturedSkills: vi.fn(),
  },
}));

const mockProfile: Profile = {
  id: 'profile-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  name: 'Arun Tripathi',
  title: 'Senior Software Engineer',
  summary: 'Building high-performance platforms.',
  socialLinks: { github: 'https://github.com/arun' },
  skills: [
    { name: 'React', category: 'frontend', level: 'expert' },
    { name: 'TypeScript', category: 'frontend', level: 'advanced' },
    { name: 'Node.js', category: 'backend', level: 'intermediate' },
  ],
  experience: [
    {
      company: 'Acme Corp',
      role: 'Senior Engineer',
      startDate: '2022-01',
      highlights: ['Led platform rebuild', 'Improved performance by 40%'],
      techStack: ['React', 'TypeScript', 'AWS'],
    },
  ],
};

const mockFeaturedSkills: Skill[] = [
  { name: 'React', category: 'frontend', level: 'expert' },
  { name: 'TypeScript', category: 'frontend', level: 'advanced' },
];

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state', () => {
    vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(profileService.getFeaturedSkills).mockResolvedValue([]);
    const { result } = renderHook(() => useProfile());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.profile).toBeNull();
    expect(result.current.featuredSkills).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loads profile and featured skills concurrently', async () => {
    vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(profileService.getFeaturedSkills).mockResolvedValue(mockFeaturedSkills);
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.featuredSkills).toEqual(mockFeaturedSkills);
    expect(result.current.error).toBeNull();
  });

  it('calls both service methods', async () => {
    vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(profileService.getFeaturedSkills).mockResolvedValue(mockFeaturedSkills);
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(profileService.getProfile)).toHaveBeenCalledOnce();
    expect(vi.mocked(profileService.getFeaturedSkills)).toHaveBeenCalledOnce();
  });

  it('sets error when getProfile rejects', async () => {
    vi.mocked(profileService.getProfile).mockRejectedValue(new Error('Profile not found'));
    vi.mocked(profileService.getFeaturedSkills).mockResolvedValue([]);
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Profile not found'));
    expect(result.current.profile).toBeNull();
  });

  it('sets error when getFeaturedSkills rejects', async () => {
    vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(profileService.getFeaturedSkills).mockRejectedValue(new Error('Skills error'));
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Skills error'));
  });

  it('wraps non-Error rejections in an Error', async () => {
    vi.mocked(profileService.getProfile).mockRejectedValue('bad response');
    vi.mocked(profileService.getFeaturedSkills).mockResolvedValue([]);
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Failed to load profile'));
  });

  it('does not update state after unmount', async () => {
    let resolveProfile!: (v: Profile) => void;
    vi.mocked(profileService.getProfile).mockReturnValue(
      new Promise((r) => {
        resolveProfile = r;
      }),
    );
    vi.mocked(profileService.getFeaturedSkills).mockResolvedValue([]);
    const { result, unmount } = renderHook(() => useProfile());
    unmount();
    resolveProfile(mockProfile);
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });
});
