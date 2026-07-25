import { AchievementList } from './AchievementList';
import type { Achievement } from '../types';

type Props = {
  achievements: Promise<Achievement[]>;
};

// Awaits its data inside a Suspense boundary so the page shell (and its LCP
// element) streams to the browser before this below-the-fold section.
export async function FeaturedAchievements({ achievements }: Props) {
  return <AchievementList achievements={await achievements} headingLevel="h3" />;
}
