import type { Achievement } from '../types';
import { achievements } from '../../../content/achievements';

export type AchievementsRepository = {
  findAll: () => Promise<Achievement[]>;
};

export const achievementsRepository: AchievementsRepository = {
  findAll: async () => achievements,
};
