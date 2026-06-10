import Link from 'next/link';
import { Card, Chip } from '@arun-dev/ui';
import { TagChips } from '@/components/TagChips';
import type { SearchResult } from '../types';
import styles from './SearchResultCard.module.css';

type Props = {
  result: SearchResult;
};

const TYPE_LABEL: Record<string, string> = {
  project: 'Project',
  article: 'Article',
};

export function SearchResultCard({ result }: Props) {
  const label = TYPE_LABEL[result.type] ?? result.type;

  return (
    <Card as="article" lift className={styles.article}>
      <div className={styles.header}>
        <Chip variant={result.type === 'project' ? 'accent' : 'default'}>{label}</Chip>
        <p className="text-size-sm font-weight-semibold text-color-primary truncate">
          {result.title}
        </p>
      </div>
      <p className="text-size-xs text-color-secondary line-clamp-2">{result.description}</p>
      {result.tags && <TagChips tags={result.tags.split(' ').filter(Boolean)} />}
      <Link href={result.href} aria-label={result.title} className={styles.overlay} />
    </Card>
  );
}
