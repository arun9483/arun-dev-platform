import Link from 'next/link';
import type { SearchResult } from '@/lib/search/searchIndex';

type Props = {
  result: SearchResult;
};

const TYPE_LABEL: Record<'project' | 'article', string> = {
  project: 'Project',
  article: 'Article',
};

export function SearchResultCard({ result }: Props) {
  const href = result.type === 'project' ? `/projects/${result.id}` : `/articles/${result.id}`;
  const chipVariant = result.type === 'project' ? 'chip-accent' : 'chip-default';

  return (
    <Link
      href={href}
      className="card block rounded-xl p-5 space-y-2 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2">
        <span className={`chip ${chipVariant}`}>{TYPE_LABEL[result.type]}</span>
        <h2 className="text-sm font-semibold text-primary truncate">{result.title}</h2>
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
