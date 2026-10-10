import { loadArticlesPage } from './page.loader';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { Heading } from '@arun-dev/ui';

export const metadata = {
  title: 'Articles',
  description: 'Deep technical articles on frontend architecture, performance, and browser APIs.',
};

export default async function ArticlesPage() {
  const { articles } = await loadArticlesPage();
  return (
    <div className="page-container stack space-xl">
      <div className="stack space-2xs">
        <Heading level={1} size="3xl" className="font-weight-bold type-display">
          Articles
        </Heading>
        <p className="text-size-base text-color-secondary">
          Deep technical writing on frontend architecture, performance, and browser APIs.
        </p>
      </div>
      <ArticleList articles={articles} />
      <p className="text-size-sm text-color-muted">More articles in progress — check back soon.</p>
    </div>
  );
}
