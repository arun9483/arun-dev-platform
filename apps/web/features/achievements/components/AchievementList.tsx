import type { Achievement } from '../types';
import { AchievementCard } from './AchievementCard';
import styles from './AchievementList.module.css';

type Props = {
  achievements: Achievement[];
  headingLevel?: 'h2' | 'h3';
};

export function AchievementList({ achievements, headingLevel = 'h2' }: Props) {
  if (achievements.length === 0) {
    return <p className="text-size-sm text-color-secondary">No achievements found.</p>;
  }

  return (
    <ul className={styles.grid}>
      {achievements.map((achievement) => (
        <li key={achievement.id}>
          <AchievementCard achievement={achievement} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
