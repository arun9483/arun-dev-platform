import { describe, it, expect, vi } from 'vitest';
import { loadAchievementsPage } from './page.loader';
import type { AchievementsService } from '@/features/achievements/services/achievementsService';
import type { Achievement } from '@/features/achievements/types';

const mockAchievement: Achievement = {
  id: 'cert-1',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  title: 'AWS CCP',
  issuer: 'AWS',
  date: '2023-01',
  type: 'certification',
  metadata: { tags: ['aws', 'cloud'], featured: true },
};

function makeMockService(overrides?: Partial<AchievementsService>): AchievementsService {
  return {
    getAll: vi.fn().mockResolvedValue([mockAchievement]),
    getFeatured: vi.fn().mockResolvedValue([mockAchievement]),
    ...overrides,
  };
}

describe('loadAchievementsPage', () => {
  it('returns all achievements from the service', async () => {
    const achievementsService = makeMockService();
    const result = await loadAchievementsPage({ achievementsService });
    expect(result.achievements).toEqual([mockAchievement]);
  });

  it('returns an empty array when no achievements exist', async () => {
    const achievementsService = makeMockService({ getAll: vi.fn().mockResolvedValue([]) });
    const result = await loadAchievementsPage({ achievementsService });
    expect(result.achievements).toEqual([]);
  });

  it('calls getAll on the service', async () => {
    const achievementsService = makeMockService();
    await loadAchievementsPage({ achievementsService });
    expect(achievementsService.getAll).toHaveBeenCalledOnce();
  });
});
