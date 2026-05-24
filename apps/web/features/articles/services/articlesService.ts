import type { Article, ArticleMeta, ArticleDifficulty } from '../types';
import type { ArticlesRepository } from '../repositories/articlesRepository';
import { articlesRepository } from '../repositories/articlesRepository';

export type ArticleFilter = {
  tag?: string;
  category?: string;
  difficulty?: ArticleDifficulty;
  featured?: boolean;
};

export type ArticlesService = {
  getAll: (filter?: ArticleFilter) => Promise<ArticleMeta[]>;
  getBySlug: (slug: string) => Promise<Article | null>;
  getFeatured: () => Promise<ArticleMeta[]>;
  getAllSlugs: () => Promise<string[]>;
};

function sortByDate(articles: ArticleMeta[]): ArticleMeta[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function createArticlesService(repository: ArticlesRepository): ArticlesService {
  return {
    getAll: async (filter) => {
      const all = await repository.findAll();
      const filtered = filter
        ? all.filter((article) => {
            if (filter.tag && !article.metadata.tags.includes(filter.tag)) return false;
            if (filter.category && article.metadata.category !== filter.category) return false;
            if (filter.difficulty && article.metadata.difficulty !== filter.difficulty)
              return false;
            if (filter.featured !== undefined && article.metadata.featured !== filter.featured)
              return false;
            return true;
          })
        : all;
      return sortByDate(filtered);
    },

    getBySlug: (slug) => repository.findBySlug(slug),

    getFeatured: async () => {
      const all = await repository.findAll();
      return sortByDate(all.filter((a) => a.metadata.featured === true));
    },

    getAllSlugs: () => repository.findAllSlugs(),
  };
}

export const articlesService = createArticlesService(articlesRepository);
