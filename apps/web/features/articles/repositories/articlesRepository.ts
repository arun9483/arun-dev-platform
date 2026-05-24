import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleMeta } from '../types';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

function parseArticleMeta(slug: string, data: Record<string, unknown>): ArticleMeta {
  return {
    id: String(data.id ?? slug),
    slug,
    title: String(data.title ?? ''),
    summary: String(data.summary ?? ''),
    publishedAt: String(data.publishedAt ?? ''),
    createdAt: String(data.createdAt ?? data.publishedAt ?? ''),
    updatedAt: String(data.updatedAt ?? data.publishedAt ?? ''),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    metadata: {
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      category: String(data.category ?? ''),
      difficulty: (data.difficulty as ArticleMeta['metadata']['difficulty']) ?? 'beginner',
      readTime: Number(data.readTime ?? 0),
      featured: Boolean(data.featured ?? false),
    },
  };
}

export type ArticlesRepository = {
  findAll: () => Promise<ArticleMeta[]>;
  findBySlug: (slug: string) => Promise<Article | null>;
  findAllSlugs: () => Promise<string[]>;
};

export const articlesRepository: ArticlesRepository = {
  findAll: async () => {
    if (!fs.existsSync(ARTICLES_DIR)) return [];
    const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'));
    return files.map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
      const { data } = matter(raw);
      return parseArticleMeta(slug, data);
    });
  },

  findBySlug: async (slug) => {
    const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    return { ...parseArticleMeta(slug, data), content };
  },

  findAllSlugs: async () => {
    if (!fs.existsSync(ARTICLES_DIR)) return [];
    return fs
      .readdirSync(ARTICLES_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));
  },
};
