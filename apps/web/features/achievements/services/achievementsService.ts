import type { Achievement } from '../types';
import type { AchievementsRepository } from '../repositories/achievementsRepository';

export type AchievementsService = {
  getFeatured: () => Promise<Achievement[]>;
};

export function createAchievementsService(repository: AchievementsRepository): AchievementsService {
  return {
    getFeatured: async () => {
      const all = await repository.findAll();
      return all.filter((a) => a.metadata.featured === true);
    },
  };
}
