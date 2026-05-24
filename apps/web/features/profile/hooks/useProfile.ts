'use client';

import { useState, useEffect } from 'react';
import type { Profile, Skill } from '../types';
import { profileService } from '../services/profileService';

export type UseProfileResult = {
  profile: Profile | null;
  featuredSkills: Skill[];
  isLoading: boolean;
  error: Error | null;
};

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [p, skills] = await Promise.all([
          profileService.getProfile(),
          profileService.getFeaturedSkills(),
        ]);
        if (!cancelled) {
          setProfile(p);
          setFeaturedSkills(skills);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load profile'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, featuredSkills, isLoading, error };
}
