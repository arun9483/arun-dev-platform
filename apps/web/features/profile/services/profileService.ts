import type { Profile, Skill, SkillCategory } from '../types';
import type { ProfileRepository } from '../repositories/profileRepository';
import { profileRepository } from '../repositories/profileRepository';

export type ProfileService = {
  getProfile: () => Promise<Profile>;
  getSkillsByCategory: (category: SkillCategory) => Promise<Skill[]>;
  getFeaturedSkills: () => Promise<Skill[]>;
};

export function createProfileService(repository: ProfileRepository): ProfileService {
  return {
    getProfile: () => repository.find(),

    getSkillsByCategory: async (category) => {
      const profile = await repository.find();
      return profile.skills.filter((s) => s.category === category);
    },

    getFeaturedSkills: async () => {
      const profile = await repository.find();
      return profile.skills.filter((s) => s.level === 'expert' || s.level === 'advanced');
    },
  };
}

export const profileService = createProfileService(profileRepository);
