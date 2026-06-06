import type { Achievement } from '../types';
import { AchievementCard } from './AchievementCard';

type Props = {
  achievements: Achievement[];
  headingLevel?: 'h2' | 'h3';
};

export function AchievementList({ achievements, headingLevel = 'h2' }: Props) {
  if (achievements.length === 0) {
    return <p className="text-sm text-secondary">No achievements found.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <li key={achievement.id}>
          <AchievementCard achievement={achievement} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
