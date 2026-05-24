import type { Profile, Skill } from '../types';
import { SkillList } from './SkillList';

type Props = {
  profile: Profile;
  featuredSkills: Skill[];
};

export function ProfileCard({ profile, featuredSkills }: Props) {
  const { name, title, summary, location, socialLinks } = profile;

  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <div className="bar-accent" />
        <div>
          <h1 className="text-4xl font-bold text-display">{name}</h1>
          <p className="text-xl mt-2 font-medium text-accent">{title}</p>
          {location && <p className="text-sm mt-1.5 text-muted">{location}</p>}
        </div>
      </div>

      <p className="text-base leading-relaxed max-w-2xl text-secondary">{summary}</p>

      <SkillList skills={featuredSkills} title="Core skills" />

      <nav aria-label="Social links" className="flex gap-3 flex-wrap">
        {socialLinks.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost hover:opacity-75"
          >
            GitHub ↗
          </a>
        )}
        {socialLinks.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost hover:opacity-75"
          >
            LinkedIn ↗
          </a>
        )}
        {socialLinks.website && (
          <a
            href={socialLinks.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost hover:opacity-75"
          >
            Website ↗
          </a>
        )}
      </nav>
    </article>
  );
}
