import { loadAchievementsPage } from './page.loader';
import { AchievementList } from '@/features/achievements/components/AchievementList';

export const metadata = {
  title: 'Achievements — Arun Dev Platform',
  description: 'Certifications, awards, and recognitions.',
};

export default async function AchievementsPage() {
  const { achievements } = await loadAchievementsPage();
  return (
    <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-display">Achievements</h1>
        <p className="text-base text-secondary">Certifications, awards, and recognitions.</p>
      </div>
      <AchievementList achievements={achievements} />
    </div>
  );
}
