import { ArticleList } from './ArticleList';
import type { ArticleMeta } from '../types';

type Props = {
  articles: Promise<ArticleMeta[]>;
};

// Awaits its data inside a Suspense boundary so the page shell (and its LCP
// element) streams to the browser before this below-the-fold section.
export async function FeaturedArticles({ articles }: Props) {
  return <ArticleList articles={await articles} headingLevel="h3" />;
}
