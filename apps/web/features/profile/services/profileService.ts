import type { Experience, Profile, Skill } from '../types';
import type { ProfileRepository } from '../repositories/profileRepository';

// Home shows a condensed timeline; the full history stays available via
// getProfile() for the agent/data layer.
const FEATURED_EXPERIENCE_COUNT = 2;
const FEATURED_HIGHLIGHTS_PER_ROLE = 2;

export type ProfileService = {
  getProfile: () => Promise<Profile>;
  getFeaturedSkills: () => Promise<Skill[]>;
  getFeaturedExperience: () => Promise<Experience[]>;
};

export function createProfileService(repository: ProfileRepository): ProfileService {
  return {
    getProfile: () => repository.find(),

    getFeaturedSkills: async () => {
      const profile = await repository.find();
      return profile.skills.filter((s) => s.level === 'expert' || s.level === 'advanced');
    },

    getFeaturedExperience: async () => {
      const profile = await repository.find();
      const byRecency = [...profile.experience].sort(
        (a, b) =>
          (b.endDate ?? '9999').localeCompare(a.endDate ?? '9999') ||
          b.startDate.localeCompare(a.startDate),
      );
      return byRecency.slice(0, FEATURED_EXPERIENCE_COUNT).map((role) => ({
        ...role,
        highlights: role.highlights.slice(0, FEATURED_HIGHLIGHTS_PER_ROLE),
      }));
    },
  };
}
