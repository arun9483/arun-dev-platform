import Link from 'next/link';
import type { SearchResult } from '../types';

type Props = {
  result: SearchResult;
};

const TYPE_LABEL: Record<string, string> = {
  project: 'Project',
  article: 'Article',
};

export function SearchResultCard({ result }: Props) {
  const chipVariant = result.type === 'project' ? 'chip-accent' : 'chip-default';
  const label = TYPE_LABEL[result.type] ?? result.type;

  return (
    <Link
      href={result.href}
      className="card block rounded-xl p-5 space-y-2 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2">
        <span className={`chip ${chipVariant}`}>{label}</span>
        <p className="text-sm font-semibold text-primary truncate">{result.title}</p>
      </div>
      <p className="text-xs text-secondary line-clamp-2">{result.description}</p>
      {result.tags && (
        <p className="text-xs text-muted">
          {result.tags
            .split(' ')
            .filter(Boolean)
            .map((t) => `#${t}`)
            .join(' ')}
        </p>
      )}
    </Link>
  );
}
