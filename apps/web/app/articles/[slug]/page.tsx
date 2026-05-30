import { notFound } from 'next/navigation';
import { loadArticleSlugs, loadArticleDetail } from './page.loader';
import { ArticleDetail } from '@/features/articles/components/ArticleDetail';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await loadArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await loadArticleDetail(slug);
  if (!data) return {};
  return { title: data.article.title, description: data.article.summary };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await loadArticleDetail(slug);
  if (!data) notFound();
  return <ArticleDetail article={data.article} />;
}
