import { loadAchievementsPage } from './page.loader';
import { AchievementList } from '@/features/achievements/components/AchievementList';

export const metadata = {
  title: 'Achievements',
  description: 'Certifications, awards, and recognitions.',
};

export default async function AchievementsPage() {
  const { achievements } = await loadAchievementsPage();
  return (
    <div className="page-container stack space-xl">
      <div className="stack space-2xs">
        <h1 className="text-size-3xl font-weight-bold type-display">Achievements</h1>
        <p className="text-size-base text-color-secondary">
          Certifications, awards, and recognitions.
        </p>
      </div>
      <AchievementList achievements={achievements} />
    </div>
  );
}
