import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeaturedAchievements } from './FeaturedAchievements';
import type { Achievement } from '../types';

// Featured achievements carry a description and credential link — the shape
// that exercises AchievementCard's optional sections.
const mockAchievement: Achievement = {
  id: 'a1',
  createdAt: '',
  updatedAt: '',
  title: 'AWS CCP',
  issuer: 'AWS',
  date: '2024-01',
  type: 'certification',
  description: 'Cloud practitioner fundamentals.',
  credentialUrl: 'https://example.com/cred',
  metadata: { tags: ['aws'], featured: true },
};

describe('FeaturedAchievements', () => {
  it('renders the list once the deferred promise resolves', async () => {
    render(await FeaturedAchievements({ achievements: Promise.resolve([mockAchievement]) }));
    expect(screen.getByText('AWS CCP')).toBeInTheDocument();
  });

  it('renders the optional description and credential link', async () => {
    render(await FeaturedAchievements({ achievements: Promise.resolve([mockAchievement]) }));
    expect(screen.getByText('Cloud practitioner fundamentals.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view credential/i })).toHaveAttribute(
      'href',
      'https://example.com/cred',
    );
  });
});
