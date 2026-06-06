import { loadHomePage } from './page.loader';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { ExperienceTimeline } from '@/features/profile/components/ExperienceTimeline';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { AchievementList } from '@/features/achievements/components/AchievementList';
import Link from 'next/link';

export default async function HomePage() {
  const { profile, featuredSkills, featuredProjects, featuredArticles, featuredAchievements } =
    await loadHomePage();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 space-y-12 sm:space-y-20">
      <section>
        <ProfileCard profile={profile} featuredSkills={featuredSkills} />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary">Experience</h2>
        <ExperienceTimeline experience={profile.experience} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary">Featured Projects</h2>
          <Link href="/projects" className="text-sm underline text-accent">
            View all
          </Link>
        </div>
        <ProjectList projects={featuredProjects} headingLevel="h3" />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary">Latest Articles</h2>
          <Link href="/articles" className="text-sm underline text-accent">
            View all
          </Link>
        </div>
        <ArticleList articles={featuredArticles} headingLevel="h3" />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary">Achievements</h2>
          <Link href="/achievements" className="text-sm underline text-accent">
            View all
          </Link>
        </div>
        <AchievementList achievements={featuredAchievements} headingLevel="h3" />
      </section>
    </div>
  );
}
