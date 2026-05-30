import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AchievementList } from './AchievementList';
import type { Achievement } from '../types';

const mockAchievement: Achievement = {
  id: 'a1',
  createdAt: '',
  updatedAt: '',
  title: 'AWS CCP',
  issuer: 'AWS',
  date: '2024-01',
  type: 'certification',
  metadata: { tags: ['aws'], featured: true },
};

describe('AchievementList', () => {
  it('renders an empty-state message when the list is empty', () => {
    render(<AchievementList achievements={[]} />);
    expect(screen.getByText('No achievements found.')).toBeInTheDocument();
  });

  it('renders one card per achievement when the list is populated', () => {
    render(<AchievementList achievements={[mockAchievement, { ...mockAchievement, id: 'a2' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
