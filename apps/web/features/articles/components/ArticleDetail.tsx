import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import type { Article } from '../types';
import { CodeBlock } from './CodeBlock';
import { BackLink } from '@/components/BackLink';
import { Cover } from '@/components/Cover';
import { TagChips } from '@/components/TagChips';

const mdxComponents = { pre: CodeBlock };
const mdxOptions = { mdxOptions: { remarkPlugins: [remarkGfm] } };

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type Props = {
  article: Article;
};

export function ArticleDetail({ article }: Props) {
  const { title, summary, publishedAt, metadata, content, coverImage } = article;
  const diff = metadata.difficulty;

  return (
    <div>
      {coverImage && <Cover src={coverImage} alt={`Cover image for ${title}`} />}

      <div className="mx-auto max-w-2xl px-6 py-8 sm:py-12 space-y-10">
        <BackLink href="/articles">Back to articles</BackLink>

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{formatDate(publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{metadata.readTime} min read</span>
            <span aria-hidden>·</span>
            <span className={`chip badge difficulty-${diff}`}>
              {DIFFICULTY_LABEL[diff] ?? diff}
            </span>
          </div>

          <div className="space-y-3">
            <div className="bar-accent" />
            <h1 className="text-4xl font-bold leading-tight text-display">{title}</h1>
          </div>

          <p className="text-base leading-relaxed text-secondary">{summary}</p>

          <TagChips tags={metadata.tags} />
        </header>

        <article className="prose max-w-none border-top-default pt-10">
          <MDXRemote source={content} components={mdxComponents} options={mdxOptions} />
        </article>
      </div>
    </div>
  );
}
