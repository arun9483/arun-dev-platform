import type { Profile } from '../types';
import { profile } from '../../../content/profile';

export type ProfileRepository = {
  find: () => Promise<Profile>;
};

export const profileRepository: ProfileRepository = {
  find: async () => profile,
};
