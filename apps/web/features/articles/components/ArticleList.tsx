import type { ArticleMeta } from '../types';
import { ArticleCard } from './ArticleCard';

type Props = {
  articles: ArticleMeta[];
};

export function ArticleList({ articles }: Props) {
  if (articles.length === 0) {
    return <p className="text-sm text-secondary">No articles found.</p>;
  }

  return (
    <ul className="space-y-6">
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleCard article={article} />
        </li>
      ))}
    </ul>
  );
}
