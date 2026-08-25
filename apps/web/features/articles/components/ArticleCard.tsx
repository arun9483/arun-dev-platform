import Link from 'next/link';
import { Card, Chip, Badge } from '@arun-dev/ui';
import type { ArticleMeta } from '../types';
import { DIFFICULTY } from '../lib/difficulty';
import styles from './ArticleCard.module.css';

type Props = {
  article: ArticleMeta;
  headingLevel?: 'h2' | 'h3';
};

export function ArticleCard({ article, headingLevel = 'h2' }: Props) {
  const { slug, title, summary, publishedAt, metadata } = article;
  const Heading = headingLevel;
  const date = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card as="article" lift className={styles.article}>
      <div className={`text-size-xs text-color-muted ${styles.meta}`}>
        <time dateTime={publishedAt}>{date}</time>
        <span aria-hidden>·</span>
        <span>{metadata.readTime} min read</span>
        <span aria-hidden>·</span>
        <Badge tone={DIFFICULTY[metadata.difficulty].tone}>
          {DIFFICULTY[metadata.difficulty].label}
        </Badge>
      </div>

      <Heading
        className={`text-size-base font-weight-semibold line-height-snug text-color-primary ${styles.heading}`}
      >
        {title}
      </Heading>

      <p className="text-size-sm line-height-relaxed text-color-secondary">{summary}</p>

      <div className={styles.tags}>
        {metadata.tags.map((tag) => (
          <Chip key={tag}>{tag}</Chip>
        ))}
      </div>

      <Link href={`/articles/${slug}`} aria-label={title} className={styles.overlay} />
    </Card>
  );
}
