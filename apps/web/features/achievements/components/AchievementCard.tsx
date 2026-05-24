import type { Achievement, AchievementType } from '../types';

type Props = {
  achievement: Achievement;
};

const TYPE_LABEL: Record<AchievementType, string> = {
  certification: 'Certification',
  award: 'Award',
  recognition: 'Recognition',
  contribution: 'Contribution',
};

export function AchievementCard({ achievement }: Props) {
  const { title, issuer, date, type, description, credentialUrl } = achievement;
  const formatted = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  return (
    <article className="card rounded-xl p-5 space-y-3 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="chip chip-accent">{TYPE_LABEL[type]}</span>
        <span className="text-xs text-muted">{formatted}</span>
      </div>

      <h3 className="font-semibold text-sm text-primary">{title}</h3>
      <p className="text-xs text-secondary">{issuer}</p>

      {description && <p className="text-xs leading-relaxed text-secondary">{description}</p>}

      {credentialUrl && (
        <a
          href={credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium underline underline-offset-2 text-accent"
        >
          View credential ↗
        </a>
      )}
    </article>
  );
}
