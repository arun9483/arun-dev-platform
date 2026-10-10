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
import { Heading } from '@arun-dev/ui';

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
          <Heading level={2} size="2xl" className="font-weight-semibold text-color-primary">
            Experience
          </Heading>
          <ExperienceTimeline experience={featuredExperience} />
        </section>

        <section className="stack space-md">
          <div className={styles.sectionHeader}>
            <Heading level={2} size="2xl" className="font-weight-semibold text-color-primary">
              Featured Projects
            </Heading>
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
            <Heading level={2} size="2xl" className="font-weight-semibold text-color-primary">
              Latest Articles
            </Heading>
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
            <Heading level={2} size="2xl" className="font-weight-semibold text-color-primary">
              Achievements
            </Heading>
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
