import type { Article, ArticleMeta } from '../types';
import type { ArticlesRepository } from '../repositories/articlesRepository';
import type { SearchDocument } from '@/lib/search/types';

export type ArticlesService = {
  getAll: () => Promise<ArticleMeta[]>;
  getBySlug: (slug: string) => Promise<Article | null>;
  getFeatured: () => Promise<ArticleMeta[]>;
  getAllSlugs: () => Promise<string[]>;
  getSearchDocuments: () => Promise<SearchDocument[]>;
};

function sortByDate(articles: ArticleMeta[]): ArticleMeta[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function articleToSearchDocument(article: ArticleMeta): SearchDocument {
  return {
    // Namespaced by type: slugs are only unique within a content type, and the
    // search index requires globally unique document IDs.
    id: `article:${article.slug}`,
    type: 'article',
    href: `/articles/${article.slug}`,
    title: article.title,
    description: article.summary,
    tags: article.metadata.tags.join(' '),
  };
}

export function createArticlesService(repository: ArticlesRepository): ArticlesService {
  return {
    getAll: async () => {
      const all = await repository.findAll();
      return sortByDate(all);
    },

    getBySlug: (slug) => repository.findBySlug(slug),

    getFeatured: async () => {
      const all = await repository.findAll();
      return sortByDate(all.filter((a) => a.metadata.featured === true));
    },

    getAllSlugs: () => repository.findAllSlugs(),

    getSearchDocuments: async () => {
      const all = await repository.findAll();
      return all.map(articleToSearchDocument);
    },
  };
}
