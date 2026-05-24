import { articlesRepository } from '@/features/articles/repositories/articlesRepository';
import { createArticlesService } from '@/features/articles/services/articlesService';
import type { ArticlesService } from '@/features/articles/services/articlesService';
import type { ArticleMeta } from '@/features/articles/types';

type ArticlesPageDeps = {
  articlesService: ArticlesService;
};

function createArticlesPageDeps(): ArticlesPageDeps {
  return { articlesService: createArticlesService(articlesRepository) };
}

export type ArticlesPageData = {
  articles: ArticleMeta[];
};

export async function loadArticlesPage(
  deps: ArticlesPageDeps = createArticlesPageDeps(),
): Promise<ArticlesPageData> {
  const articles = await deps.articlesService.getAll();
  return { articles };
}
