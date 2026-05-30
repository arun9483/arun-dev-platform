import type { Profile, Skill } from '../types';
import type { ProfileRepository } from '../repositories/profileRepository';

export type ProfileService = {
  getProfile: () => Promise<Profile>;
  getFeaturedSkills: () => Promise<Skill[]>;
};

export function createProfileService(repository: ProfileRepository): ProfileService {
  return {
    getProfile: () => repository.find(),

    getFeaturedSkills: async () => {
      const profile = await repository.find();
      return profile.skills.filter((s) => s.level === 'expert' || s.level === 'advanced');
    },
  };
}
