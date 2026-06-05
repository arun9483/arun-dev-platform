import { describe, it, expect } from 'vitest';
import { createAchievementsService } from './achievementsService';
import type { AchievementsRepository } from '../repositories/achievementsRepository';
import type { Achievement } from '../types';

const mockAchievements: Achievement[] = [
  {
    id: 'cert-1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    title: 'AWS CCP',
    issuer: 'AWS',
    date: '2023-01',
    type: 'certification',
    metadata: { tags: ['aws', 'cloud'], featured: true },
  },
  {
    id: 'award-1',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
    title: 'Best Engineer',
    issuer: 'Acme',
    date: '2023-06',
    type: 'award',
    metadata: { tags: ['performance'], featured: true },
  },
  {
    id: 'contrib-1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    title: 'OSS Contributor',
    issuer: 'GitHub',
    date: '2024-01',
    type: 'contribution',
    metadata: { tags: ['open-source'], featured: false },
  },
];

const mockRepository: AchievementsRepository = {
  findAll: async () => mockAchievements,
};

describe('achievementsService', () => {
  const service = createAchievementsService(mockRepository);

  it('returns all achievements', async () => {
    const result = await service.getAll();
    expect(result).toHaveLength(3);
  });

  it('returns only featured achievements', async () => {
    const result = await service.getFeatured();
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.metadata.featured)).toBe(true);
  });
});
