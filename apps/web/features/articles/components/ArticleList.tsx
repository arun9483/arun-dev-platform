import type { ArticleMeta } from '../types';
import { ArticleCard } from './ArticleCard';
import styles from './ArticleList.module.css';

type Props = {
  articles: ArticleMeta[];
  headingLevel?: 'h2' | 'h3';
};

export function ArticleList({ articles, headingLevel = 'h2' }: Props) {
  if (articles.length === 0) {
    return <p className="text-size-sm text-color-secondary">No articles found.</p>;
  }

  return (
    <ul className={styles.list}>
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleCard article={article} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
