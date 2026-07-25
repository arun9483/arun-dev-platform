import { Suspense } from 'react';
import { loadHomePage } from './page.loader';
import { ProfileCard } from '@/features/profile/components/ProfileCard';
import { ExperienceTimeline } from '@/features/profile/components/ExperienceTimeline';
import { FeaturedProjects } from '@/features/projects/components/FeaturedProjects';
import { FeaturedArticles } from '@/features/articles/components/FeaturedArticles';
import { FeaturedAchievements } from '@/features/achievements/components/FeaturedAchievements';
import { Cover } from '@/components/Cover';
import Link from 'next/link';
import styles from './page.module.css';

export default async function HomePage() {
  const {
    profile,
    featuredSkills,
    featuredExperience,
    featuredProjects,
    featuredArticles,
    featuredAchievements,
  } = await loadHomePage();

  return (
    <>
      <Cover src="placeholder" alt="" />
      <div className={`page-container ${styles.sections}`}>
        <section>
          <ProfileCard profile={profile} featuredSkills={featuredSkills} />
        </section>

        <section className="stack space-md">
          <h2 className="text-size-2xl font-weight-semibold text-color-primary">Experience</h2>
          <ExperienceTimeline experience={featuredExperience} />
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
          <Suspense fallback={<div className={styles.sectionPlaceholder} aria-hidden="true" />}>
            <FeaturedProjects projects={featuredProjects} />
          </Suspense>
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
          <Suspense fallback={<div className={styles.sectionPlaceholder} aria-hidden="true" />}>
            <FeaturedArticles articles={featuredArticles} />
          </Suspense>
        </section>

        <section className="stack space-md">
          <div className={styles.sectionHeader}>
            <h2 className="text-size-2xl font-weight-semibold text-color-primary">Achievements</h2>
            <Link href="/achievements" className="text-size-sm underline text-color-accent">
              View all
            </Link>
          </div>
          <Suspense fallback={<div className={styles.sectionPlaceholder} aria-hidden="true" />}>
            <FeaturedAchievements achievements={featuredAchievements} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
