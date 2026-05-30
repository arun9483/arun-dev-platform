import { projectsRepository } from '@/features/projects/repositories/projectsRepository';
import { articlesRepository } from '@/features/articles/repositories/articlesRepository';
import { createProjectsService } from '@/features/projects/services/projectsService';
import { createArticlesService } from '@/features/articles/services/articlesService';
import { createSearchService } from '@/features/agent/services/searchService';
import type { SearchService } from '@/features/agent/services/searchService';
import type { SearchDocument } from '@/lib/search/types';

type SearchPageDeps = {
  searchService: SearchService;
};

function createSearchPageDeps(): SearchPageDeps {
  return {
    searchService: createSearchService([
      createProjectsService(projectsRepository),
      createArticlesService(articlesRepository),
    ]),
  };
}

export type SearchPageData = {
  documents: SearchDocument[];
};

export async function loadSearchPage(
  deps: SearchPageDeps = createSearchPageDeps(),
): Promise<SearchPageData> {
  const documents = await deps.searchService.getDocuments();
  return { documents };
}
