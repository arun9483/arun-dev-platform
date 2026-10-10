import { Heading, Link } from '@arun-dev/ui';
import type { Profile, Skill } from '../types';
import { SkillList } from './SkillList';
import styles from './ProfileCard.module.css';

type Props = {
  profile: Profile;
  featuredSkills: Skill[];
};

export function ProfileCard({ profile, featuredSkills }: Props) {
  const { name, title, summary, location, socialLinks } = profile;

  return (
    <article className={styles.card} aria-labelledby="profile-name">
      <div className={styles.intro}>
        <div className="bar-accent" />
        <div className={styles.nameBlock}>
          <Heading level={1} size="4xl" id="profile-name" className="font-weight-bold type-display">
            {name}
          </Heading>
          <p className={`text-size-xl font-weight-medium text-color-accent ${styles.title}`}>
            {title}
          </p>
          {location && (
            <p className={`text-size-sm text-color-muted ${styles.location}`}>{location}</p>
          )}
        </div>
      </div>

      <p className={`text-size-base line-height-relaxed text-color-secondary ${styles.summary}`}>
        {summary}
      </p>

      <SkillList skills={featuredSkills} title="Core skills" />

      <nav aria-label="Social links" className={styles.socialLinks}>
        {socialLinks.github && (
          <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗<span className="sr-only"> (opens in new tab)</span>
          </Link>
        )}
        {socialLinks.linkedin && (
          <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗<span className="sr-only"> (opens in new tab)</span>
          </Link>
        )}
        {socialLinks.website && (
          <Link href={socialLinks.website} target="_blank" rel="noopener noreferrer">
            Website ↗<span className="sr-only"> (opens in new tab)</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
