import type { Achievement } from '../types';
import type { AchievementsRepository } from '../repositories/achievementsRepository';

export type AchievementsService = {
  getAll: () => Promise<Achievement[]>;
  getFeatured: () => Promise<Achievement[]>;
};

export function createAchievementsService(repository: AchievementsRepository): AchievementsService {
  return {
    getAll: () => repository.findAll(),
    getFeatured: async () => {
      const all = await repository.findAll();
      return all.filter((a) => a.metadata.featured === true);
    },
  };
}
