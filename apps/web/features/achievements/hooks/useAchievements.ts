'use client';

import { useState, useEffect } from 'react';
import type { Achievement } from '../types';
import { achievementsService } from '../services/achievementsService';
import type { AchievementFilter } from '../services/achievementsService';

export type UseAchievementsResult = {
  achievements: Achievement[];
  isLoading: boolean;
  error: Error | null;
};

export function useAchievements(filter?: AchievementFilter): UseAchievementsResult {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const type = filter?.type;
  const featured = filter?.featured;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await achievementsService.getAll({ type, featured });
        if (!cancelled) setAchievements(result);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error('Failed to load achievements'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [type, featured]);

  return { achievements, isLoading, error };
}
