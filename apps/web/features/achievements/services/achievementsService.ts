import type { Achievement, AchievementType } from '../types';
import type { AchievementsRepository } from '../repositories/achievementsRepository';
import { achievementsRepository } from '../repositories/achievementsRepository';

export type AchievementFilter = {
  type?: AchievementType;
  featured?: boolean;
};

export type AchievementsService = {
  getAll: (filter?: AchievementFilter) => Promise<Achievement[]>;
  getFeatured: () => Promise<Achievement[]>;
};

export function createAchievementsService(repository: AchievementsRepository): AchievementsService {
  return {
    getAll: async (filter) => {
      const all = await repository.findAll();
      if (!filter) return all;

      return all.filter((achievement) => {
        if (filter.type && achievement.type !== filter.type) return false;
        if (filter.featured !== undefined && achievement.metadata.featured !== filter.featured)
          return false;
        return true;
      });
    },

    getFeatured: async () => {
      const all = await repository.findAll();
      return all.filter((a) => a.metadata.featured === true);
    },
  };
}

export const achievementsService = createAchievementsService(achievementsRepository);
