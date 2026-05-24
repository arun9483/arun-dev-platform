type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ArticleDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ArticleMetadata = {
  tags: string[];
  category: string;
  difficulty: ArticleDifficulty;
  readTime: number;
  featured?: boolean;
};

export type ArticleMeta = BaseEntity & {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  coverImage?: string;
  metadata: ArticleMetadata;
};

export type Article = ArticleMeta & {
  content: string;
};
