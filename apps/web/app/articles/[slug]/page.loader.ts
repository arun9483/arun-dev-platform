import { articlesRepository } from '@/features/articles/repositories/articlesRepository';
import { createArticlesService } from '@/features/articles/services/articlesService';
import type { ArticlesService } from '@/features/articles/services/articlesService';
import type { Article } from '@/features/articles/types';

type ArticleDetailDeps = {
  articlesService: ArticlesService;
};

function createArticleDetailDeps(): ArticleDetailDeps {
  return { articlesService: createArticlesService(articlesRepository) };
}

export type ArticleDetailData = {
  article: Article;
};

export async function loadArticleSlugs(
  deps: ArticleDetailDeps = createArticleDetailDeps(),
): Promise<string[]> {
  return deps.articlesService.getAllSlugs();
}

export async function loadArticleDetail(
  slug: string,
  deps: ArticleDetailDeps = createArticleDetailDeps(),
): Promise<ArticleDetailData | null> {
  const article = await deps.articlesService.getBySlug(slug);
  if (!article) return null;
  return { article };
}
