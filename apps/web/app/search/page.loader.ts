import { projectsRepository } from '@/features/projects/repositories/projectsRepository';
import { articlesRepository } from '@/features/articles/repositories/articlesRepository';
import { createProjectsService } from '@/features/projects/services/projectsService';
import { createArticlesService } from '@/features/articles/services/articlesService';
import type { ProjectsService } from '@/features/projects/services/projectsService';
import type { ArticlesService } from '@/features/articles/services/articlesService';
import type { Project } from '@/features/projects/types';
import type { ArticleMeta } from '@/features/articles/types';
import type { SearchDocument } from '@/lib/search/searchIndex';

type SearchPageDeps = {
  projectsService: ProjectsService;
  articlesService: ArticlesService;
};

function createSearchPageDeps(): SearchPageDeps {
  return {
    projectsService: createProjectsService(projectsRepository),
    articlesService: createArticlesService(articlesRepository),
  };
}

export function toSearchDocuments(projects: Project[], articles: ArticleMeta[]): SearchDocument[] {
  return [
    ...projects.map((p) => ({
      id: p.slug,
      type: 'project' as const,
      title: p.title,
      description: p.description,
      tags: p.metadata.tags.join(' '),
      techStack: p.techStack.join(' '),
    })),
    ...articles.map((a) => ({
      id: a.slug,
      type: 'article' as const,
      title: a.title,
      description: a.summary,
      tags: a.metadata.tags.join(' '),
    })),
  ];
}

export type SearchPageData = {
  documents: SearchDocument[];
};

export async function loadSearchPage(
  deps: SearchPageDeps = createSearchPageDeps(),
): Promise<SearchPageData> {
  const [projects, articles] = await Promise.all([
    deps.projectsService.getAll(),
    deps.articlesService.getAll(),
  ]);
  return { documents: toSearchDocuments(projects, articles) };
}
