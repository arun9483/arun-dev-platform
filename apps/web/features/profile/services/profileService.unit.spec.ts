import { describe, it, expect } from 'vitest';
import { createProfileService } from './profileService';
import type { ProfileRepository } from '../repositories/profileRepository';
import type { Profile } from '../types';

const mockProfile: Profile = {
  id: 'test-profile',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  name: 'Test User',
  title: 'Engineer',
  summary: 'A test engineer.',
  socialLinks: {},
  skills: [
    { name: 'React', category: 'frontend', level: 'expert' },
    { name: 'TypeScript', category: 'frontend', level: 'advanced' },
    { name: 'Node.js', category: 'backend', level: 'intermediate' },
    { name: 'Docker', category: 'tools', level: 'beginner' },
  ],
  experience: [
    {
      company: 'Acme',
      role: 'Engineer',
      startDate: '2022-01',
      highlights: ['Built things'],
      techStack: ['React'],
    },
  ],
};

const mockRepository: ProfileRepository = {
  find: async () => mockProfile,
};

describe('profileService', () => {
  const service = createProfileService(mockRepository);

  it('returns the full profile', async () => {
    const result = await service.getProfile();
    expect(result.id).toBe('test-profile');
    expect(result.name).toBe('Test User');
  });

  it('returns only expert and advanced skills as featured', async () => {
    const skills = await service.getFeaturedSkills();
    expect(skills).toHaveLength(2);
    expect(skills.map((s) => s.name)).toEqual(['React', 'TypeScript']);
  });

  it('returns the 2 most recent roles with at most 2 highlights each', async () => {
    const repository: ProfileRepository = {
      find: async () => ({
        ...mockProfile,
        experience: [
          {
            company: 'Oldest',
            role: 'Junior',
            startDate: '2015-01',
            endDate: '2018-01',
            highlights: ['a', 'b', 'c'],
            techStack: [],
          },
          {
            company: 'Current',
            role: 'Staff',
            startDate: '2022-01',
            highlights: ['one', 'two', 'three', 'four'],
            techStack: [],
          },
          {
            company: 'Middle',
            role: 'Senior',
            startDate: '2018-02',
            endDate: '2021-12',
            highlights: ['x'],
            techStack: [],
          },
        ],
      }),
    };
    const featured = await createProfileService(repository).getFeaturedExperience();
    expect(featured.map((e) => e.company)).toEqual(['Current', 'Middle']);
    expect(featured.at(0)?.highlights).toEqual(['one', 'two']);
    expect(featured.at(1)?.highlights).toEqual(['x']);
  });

  it('ranks current roles (no endDate) above ended ones and breaks ties by start date', async () => {
    const repository: ProfileRepository = {
      find: async () => ({
        ...mockProfile,
        experience: [
          {
            company: 'EndedRecently',
            role: 'Senior',
            startDate: '2020-01',
            endDate: '2024-06',
            highlights: [],
            techStack: [],
          },
          {
            company: 'CurrentOlderStart',
            role: 'Staff',
            startDate: '2021-01',
            highlights: [],
            techStack: [],
          },
          {
            company: 'CurrentNewerStart',
            role: 'Principal',
            startDate: '2023-01',
            highlights: [],
            techStack: [],
          },
        ],
      }),
    };
    const featured = await createProfileService(repository).getFeaturedExperience();
    expect(featured.map((e) => e.company)).toEqual(['CurrentNewerStart', 'CurrentOlderStart']);
  });

  it('does not mutate the repository experience ordering', async () => {
    const profile = await service.getProfile();
    const before = profile.experience.map((e) => e.company);
    await service.getFeaturedExperience();
    expect((await service.getProfile()).experience.map((e) => e.company)).toEqual(before);
  });
});
