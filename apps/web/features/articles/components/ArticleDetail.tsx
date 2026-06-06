import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import type { Article } from '../types';
import { CodeBlock } from './CodeBlock';
import { BackLink } from '@/components/BackLink';
import { Cover } from '@/components/Cover';
import { TagChips } from '@/components/TagChips';

type TocEntry = { id: string; text: string; level: number };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function extractToc(content: string): TocEntry[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const hashes = match[1] ?? '';
    const text = (match[2] ?? '').trim();
    entries.push({ level: hashes.length, text, id: slugify(text) });
  }
  return entries;
}

function makeHeading(level: 2 | 3) {
  return function HeadingWithId({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const Tag = `h${level}` as 'h2' | 'h3';
    const id = typeof children === 'string' ? slugify(children) : undefined;
    return (
      <Tag id={id} {...props}>
        {children}
      </Tag>
    );
  };
}

const mdxComponents = { pre: CodeBlock, h2: makeHeading(2), h3: makeHeading(3) };
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
  const toc = extractToc(content);

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

        {toc.length >= 2 && (
          <nav aria-label="Table of contents" className="card rounded-xl px-5 py-4 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              On this page
            </p>
            <ul className="space-y-1.5">
              {toc.map(({ id, text, level }) => (
                <li key={id} style={{ paddingLeft: `${(level - 2) * 14}px` }}>
                  <a
                    href={`#${id}`}
                    className="text-sm text-secondary hover:text-accent transition-colors"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <article className="prose max-w-none border-top-default pt-10">
          <MDXRemote source={content} components={mdxComponents} options={mdxOptions} />
        </article>
      </div>
    </div>
  );
}
