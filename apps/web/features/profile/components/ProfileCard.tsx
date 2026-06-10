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
          <h1 id="profile-name" className="text-size-4xl font-weight-bold type-display">
            {name}
          </h1>
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
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            GitHub ↗<span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
        {socialLinks.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            LinkedIn ↗<span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
        {socialLinks.website && (
          <a
            href={socialLinks.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Website ↗<span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
      </nav>
    </article>
  );
}
