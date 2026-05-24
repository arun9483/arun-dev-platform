import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAchievements } from './useAchievements';
import { achievementsService } from '../services/achievementsService';
import type { Achievement } from '../types';

vi.mock('../services/achievementsService', () => ({
  achievementsService: {
    getAll: vi.fn(),
    getFeatured: vi.fn(),
  },
}));

const mockAchievement: Achievement = {
  id: 'a1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  title: 'AWS Certified Developer',
  issuer: 'Amazon',
  date: '2024-01-01',
  type: 'certification',
  metadata: { tags: ['cloud', 'aws'], featured: true },
};

const mockAward: Achievement = {
  id: 'a2',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  title: 'Best Engineer Award',
  issuer: 'Company',
  date: '2024-06-01',
  type: 'award',
  metadata: { tags: ['leadership'], featured: false },
};

describe('useAchievements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in loading state', () => {
    vi.mocked(achievementsService.getAll).mockResolvedValue([]);
    const { result } = renderHook(() => useAchievements());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.achievements).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loads achievements and clears loading state', async () => {
    vi.mocked(achievementsService.getAll).mockResolvedValue([mockAchievement]);
    const { result } = renderHook(() => useAchievements());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.achievements).toEqual([mockAchievement]);
    expect(result.current.error).toBeNull();
  });

  it('passes filter to service', async () => {
    vi.mocked(achievementsService.getAll).mockResolvedValue([mockAchievement]);
    const { result } = renderHook(() => useAchievements({ type: 'certification' }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(achievementsService.getAll)).toHaveBeenCalledWith({
      type: 'certification',
      featured: undefined,
    });
  });

  it('passes featured filter to service', async () => {
    vi.mocked(achievementsService.getAll).mockResolvedValue([mockAchievement]);
    const { result } = renderHook(() => useAchievements({ featured: true }));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(vi.mocked(achievementsService.getAll)).toHaveBeenCalledWith({
      type: undefined,
      featured: true,
    });
  });

  it('re-fetches when filter type changes', async () => {
    vi.mocked(achievementsService.getAll).mockResolvedValue([mockAchievement]);
    const { rerender } = renderHook(
      ({ type }: { type?: 'certification' | 'award' }) => useAchievements({ type }),
      { initialProps: { type: 'certification' as const } },
    );
    await waitFor(() =>
      expect(vi.mocked(achievementsService.getAll)).toHaveBeenCalledWith({
        type: 'certification',
        featured: undefined,
      }),
    );
    vi.mocked(achievementsService.getAll).mockResolvedValue([mockAward]);
    rerender({ type: 'award' });
    await waitFor(() =>
      expect(vi.mocked(achievementsService.getAll)).toHaveBeenCalledWith({
        type: 'award',
        featured: undefined,
      }),
    );
  });

  it('sets error when service rejects', async () => {
    vi.mocked(achievementsService.getAll).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useAchievements());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Network error'));
    expect(result.current.achievements).toEqual([]);
  });

  it('wraps non-Error rejections in an Error', async () => {
    vi.mocked(achievementsService.getAll).mockRejectedValue('string error');
    const { result } = renderHook(() => useAchievements());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error('Failed to load achievements'));
  });

  it('does not update state after unmount', async () => {
    let resolve!: (v: Achievement[]) => void;
    vi.mocked(achievementsService.getAll).mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );
    const { result, unmount } = renderHook(() => useAchievements());
    unmount();
    resolve([mockAchievement]);
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.achievements).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });
});
