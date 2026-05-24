import type { Achievement } from '../types';
import { AchievementCard } from './AchievementCard';

type Props = {
  achievements: Achievement[];
};

export function AchievementList({ achievements }: Props) {
  if (achievements.length === 0) {
    return <p className="text-sm text-secondary">No achievements found.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {achievements.map((achievement) => (
        <li key={achievement.id}>
          <AchievementCard achievement={achievement} />
        </li>
      ))}
    </ul>
  );
}
