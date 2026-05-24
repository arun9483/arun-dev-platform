import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import { loadArticleSlugs, loadArticleDetail } from './page.loader';
import { CodeBlock } from '@/features/articles/components/CodeBlock';

type Props = { params: Promise<{ slug: string }> };

const mdxComponents = {
  pre: CodeBlock,
};

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

export async function generateStaticParams() {
  const slugs = await loadArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await loadArticleDetail(slug);
  if (!data) return {};
  return {
    title: data.article.title,
    description: data.article.summary,
  };
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadArticleDetail(slug);
  if (!data) notFound();

  const { title, summary, publishedAt, metadata, content, coverImage } = data.article;
  const date = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const diff = metadata.difficulty;

  return (
    <div>
      {coverImage && (
        <div className="cover">
          <Image
            src={coverImage}
            alt={`Cover image for ${title}`}
            width={1200}
            height={480}
            className="w-full object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 py-12 space-y-10">
        <Link href="/articles" className="link-back hover:opacity-75">
          ← Back to articles
        </Link>

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{date}</span>
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

          <div className="flex flex-wrap gap-1.5">
            {metadata.tags.map((tag) => (
              <span key={tag} className="chip chip-default">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <article className="prose max-w-none border-top-default pt-10">
          <MDXRemote source={content} components={mdxComponents} options={mdxOptions} />
        </article>
      </div>
    </div>
  );
}
