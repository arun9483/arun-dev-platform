'use client';

import { useState, useEffect } from 'react';
import type { ArticleMeta } from '../types';
import { articlesService } from '../services/articlesService';
import type { ArticleFilter } from '../services/articlesService';

export type UseArticlesResult = {
  articles: ArticleMeta[];
  isLoading: boolean;
  error: Error | null;
};

export function useArticles(filter?: ArticleFilter): UseArticlesResult {
  const [articles, setArticles] = useState<ArticleMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const tag = filter?.tag;
  const category = filter?.category;
  const difficulty = filter?.difficulty;
  const featured = filter?.featured;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await articlesService.getAll({ tag, category, difficulty, featured });
        if (!cancelled) setArticles(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load articles'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tag, category, difficulty, featured]);

  return { articles, isLoading, error };
}
