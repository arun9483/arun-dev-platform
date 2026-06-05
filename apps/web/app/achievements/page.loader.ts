import { achievementsRepository } from '@/features/achievements/repositories/achievementsRepository';
import { createAchievementsService } from '@/features/achievements/services/achievementsService';
import type { AchievementsService } from '@/features/achievements/services/achievementsService';
import type { Achievement } from '@/features/achievements/types';

type AchievementsPageDeps = {
  achievementsService: AchievementsService;
};

function createAchievementsPageDeps(): AchievementsPageDeps {
  return { achievementsService: createAchievementsService(achievementsRepository) };
}

export type AchievementsPageData = {
  achievements: Achievement[];
};

export async function loadAchievementsPage(
  deps: AchievementsPageDeps = createAchievementsPageDeps(),
): Promise<AchievementsPageData> {
  const achievements = await deps.achievementsService.getAll();
  return { achievements };
}
