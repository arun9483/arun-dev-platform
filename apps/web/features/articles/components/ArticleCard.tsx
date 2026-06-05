import Link from 'next/link';
import type { ArticleMeta } from '../types';

type Props = {
  article: ArticleMeta;
};

const DIFFICULTY_LABEL: Record<ArticleMeta['metadata']['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function ArticleCard({ article }: Props) {
  const { slug, title, summary, publishedAt, metadata } = article;
  const date = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="card rounded-xl p-6 space-y-4 transition-shadow hover:shadow-md relative group">
      <div className="flex items-center gap-2 text-xs text-muted">
        <time dateTime={publishedAt}>{date}</time>
        <span aria-hidden>·</span>
        <span>{metadata.readTime} min read</span>
        <span aria-hidden>·</span>
        <span className={`chip badge difficulty-${metadata.difficulty}`}>
          {DIFFICULTY_LABEL[metadata.difficulty]}
        </span>
      </div>

      <h2 className="text-base font-semibold leading-snug text-primary group-hover:underline">
        {title}
      </h2>

      <p className="text-sm leading-relaxed text-secondary">{summary}</p>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {metadata.tags.map((tag) => (
          <span key={tag} className="chip chip-default">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/articles/${slug}`}
        aria-label={title}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-text-accent)]"
      />
    </article>
  );
}
