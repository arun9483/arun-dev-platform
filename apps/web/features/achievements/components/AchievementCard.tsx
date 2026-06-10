import { Card, Chip } from '@arun-dev/ui';
import type { Achievement, AchievementType } from '../types';
import styles from './AchievementCard.module.css';

type Props = {
  achievement: Achievement;
  headingLevel?: 'h2' | 'h3';
};

const TYPE_LABEL: Record<AchievementType, string> = {
  certification: 'Certification',
  award: 'Award',
  recognition: 'Recognition',
  contribution: 'Contribution',
};

export function AchievementCard({ achievement, headingLevel = 'h2' }: Props) {
  const { title, issuer, date, type, description, credentialUrl } = achievement;
  const Heading = headingLevel;
  const formatted = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  return (
    <Card as="article" className={styles.article}>
      <div className={styles.header}>
        <Chip variant="accent">{TYPE_LABEL[type]}</Chip>
        <time dateTime={date} className="text-size-xs text-color-muted">
          {formatted}
        </time>
      </div>

      <Heading className="font-weight-semibold text-size-sm text-color-primary">{title}</Heading>
      <p className="text-size-xs text-color-secondary">{issuer}</p>

      {description && (
        <p className="text-size-xs line-height-relaxed text-color-secondary">{description}</p>
      )}

      <div className={styles.spacer} />

      {credentialUrl && (
        <a
          href={credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-size-xs font-weight-medium text-color-accent ${styles.credential}`}
        >
          View credential ↗<span className="sr-only"> (opens in new tab)</span>
        </a>
      )}
    </Card>
  );
}
