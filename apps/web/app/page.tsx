import { loadHomePage } from './page.loader';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { ExperienceTimeline } from '@/features/profile/components/ExperienceTimeline';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { AchievementList } from '@/features/achievements/components/AchievementList';
import { Cover } from '@/components/Cover';
import Link from 'next/link';
import styles from './page.module.css';

export default async function HomePage() {
  const { profile, featuredSkills, featuredProjects, featuredArticles, featuredAchievements } =
    await loadHomePage();

  return (
    <>
      <Cover src="placeholder" alt="" />
      <div className={`page-container ${styles.sections}`}>
        <section>
          <ProfileCard profile={profile} featuredSkills={featuredSkills} />
        </section>

        <section className="stack space-md">
          <h2 className="text-size-2xl font-weight-semibold text-color-primary">Experience</h2>
          <ExperienceTimeline experience={profile.experience} />
        </section>

        <section className="stack space-md">
          <div className={styles.sectionHeader}>
            <h2 className="text-size-2xl font-weight-semibold text-color-primary">
              Featured Projects
            </h2>
            <Link href="/projects" className="text-size-sm underline text-color-accent">
              View all
            </Link>
          </div>
          <ProjectList projects={featuredProjects} headingLevel="h3" />
        </section>

        <section className="stack space-md">
          <div className={styles.sectionHeader}>
            <h2 className="text-size-2xl font-weight-semibold text-color-primary">
              Latest Articles
            </h2>
            <Link href="/articles" className="text-size-sm underline text-color-accent">
              View all
            </Link>
          </div>
          <ArticleList articles={featuredArticles} headingLevel="h3" />
        </section>

        <section className="stack space-md">
          <div className={styles.sectionHeader}>
            <h2 className="text-size-2xl font-weight-semibold text-color-primary">Achievements</h2>
            <Link href="/achievements" className="text-size-sm underline text-color-accent">
              View all
            </Link>
          </div>
          <AchievementList achievements={featuredAchievements} headingLevel="h3" />
        </section>
      </div>
    </>
  );
}
