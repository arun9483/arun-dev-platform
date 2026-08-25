import { isValidElement } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Badge } from '@arun-dev/ui';
import type { Article } from '../types';
import { difficultyPresentation } from '../lib/difficulty';
import { CodeBlock } from './CodeBlock';
import { BackLink } from '@/components/BackLink';
import { Cover } from '@/components/Cover';
import { TagChips } from '@/components/TagChips';
import styles from './ArticleDetail.module.css';

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

function PreBlock({ children, className }: React.HTMLAttributes<HTMLPreElement>) {
  const ownLang = className?.replace('language-', '') ?? '';
  const codeEl = isValidElement(children)
    ? (children as React.ReactElement<{ className?: string; children?: string }>)
    : null;
  const childLang = (codeEl?.props?.className ?? '').replace('language-', '');
  const lang = ownLang || childLang || 'code';
  const rawCode = String(codeEl?.props?.children ?? '').trimEnd();
  return <CodeBlock lang={lang} rawCode={rawCode} />;
}

const mdxComponents = { pre: PreBlock, h2: makeHeading(2), h3: makeHeading(3) };
const mdxOptions = { mdxOptions: { remarkPlugins: [remarkGfm] } };

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
  const difficulty = difficultyPresentation(metadata.difficulty);
  const toc = extractToc(content);

  const tocNav =
    toc.length >= 2 ? (
      <nav aria-label="Table of contents" className={`card ${styles.toc}`}>
        <p className="text-size-xs font-weight-semibold uppercase letter-spacing-wider text-color-muted">
          On this page
        </p>
        <ul className={styles.tocList}>
          {toc.map(({ id, text, level }) => (
            <li
              key={id}
              className={styles.tocItem}
              style={{ '--toc-depth': level - 2 } as React.CSSProperties}
            >
              <a href={`#${id}`} className={`text-size-sm text-color-secondary ${styles.tocLink}`}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    ) : null;

  return (
    <div>
      {coverImage && (
        <Cover src={coverImage} alt={`Cover image for ${title}`}>
          <BackLink href="/articles">Back to articles</BackLink>
        </Cover>
      )}

      <div className={styles.container}>
        {!coverImage && <BackLink href="/articles">Back to articles</BackLink>}

        <div className={styles.layout}>
          {tocNav && (
            <aside className={styles.sidebar} aria-label="Article navigation">
              {tocNav}
            </aside>
          )}

          <div className={styles.main}>
            <header className={styles.header}>
              <div className={`text-size-xs text-color-muted ${styles.meta}`}>
                <span>{formatDate(publishedAt)}</span>
                <span aria-hidden>·</span>
                <span>{metadata.readTime} min read</span>
                <span aria-hidden>·</span>
                <Badge tone={difficulty.tone}>{difficulty.label}</Badge>
              </div>

              <div className={styles.headerInner}>
                <div className="bar-accent" />
                <h1 className="text-size-4xl font-weight-bold line-height-tight type-display">
                  {title}
                </h1>
              </div>

              <p className="text-size-base line-height-relaxed text-color-secondary">{summary}</p>

              <TagChips tags={metadata.tags} />
            </header>

            {tocNav && <div className={styles.tocMobile}>{tocNav}</div>}

            <article className={`prose ${styles.prose}`}>
              <MDXRemote source={content} components={mdxComponents} options={mdxOptions} />
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
