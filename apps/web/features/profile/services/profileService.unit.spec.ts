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
});
