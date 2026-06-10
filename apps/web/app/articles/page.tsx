import { loadArticlesPage } from './page.loader';
import { ArticleList } from '@/features/articles/components/ArticleList';

export const metadata = {
  title: 'Articles',
  description: 'Deep technical articles on frontend architecture, performance, and browser APIs.',
};

export default async function ArticlesPage() {
  const { articles } = await loadArticlesPage();
  return (
    <div className="page-container stack space-xl">
      <div className="stack space-2xs">
        <h1 className="text-size-3xl font-weight-bold type-display">Articles</h1>
        <p className="text-size-base text-color-secondary">
          Deep technical writing on frontend architecture, performance, and browser APIs.
        </p>
      </div>
      <ArticleList articles={articles} />
      <p className="text-size-sm text-color-muted">More articles in progress — check back soon.</p>
    </div>
  );
}
