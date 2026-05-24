import { loadArticlesPage } from './page.loader';
import { ArticleList } from '@/features/articles/components/ArticleList';

export const metadata = {
  title: 'Articles — Arun Dev Platform',
  description: 'Deep technical articles on frontend architecture, performance, and browser APIs.',
};

export default async function ArticlesPage() {
  const { articles } = await loadArticlesPage();
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-display">Articles</h1>
        <p className="text-base text-secondary">
          Deep technical writing on frontend architecture, performance, and browser APIs.
        </p>
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}
