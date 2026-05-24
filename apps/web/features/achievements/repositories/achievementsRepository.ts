import type { Achievement } from '../types';
import { achievements } from '../../../content/achievements';

export type AchievementsRepository = {
  findAll: () => Promise<Achievement[]>;
  findById: (id: string) => Promise<Achievement | null>;
};

export const achievementsRepository: AchievementsRepository = {
  findAll: async () => achievements,
  findById: async (id) => achievements.find((a) => a.id === id) ?? null,
};
