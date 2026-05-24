import type { Project } from '@/features/projects/types';
import type { ArticleMeta } from '@/features/articles/types';
import type { SearchDocument } from './searchIndex';

export function projectToSearchDocument(project: Project): SearchDocument {
  return {
    id: project.id,
    type: 'project',
    title: project.title,
    description: project.description,
    tags: project.metadata.tags.join(' '),
    techStack: project.techStack.join(' '),
  };
}

export function articleToSearchDocument(article: ArticleMeta): SearchDocument {
  return {
    id: article.id,
    type: 'article',
    title: article.title,
    description: article.summary,
    tags: article.metadata.tags.join(' '),
  };
}
