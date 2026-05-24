import { projectsRepository } from '@/features/projects/repositories/projectsRepository';
import { createProjectsService } from '@/features/projects/services/projectsService';
import type { ProjectsService } from '@/features/projects/services/projectsService';
import type { Project } from '@/features/projects/types';

type ProjectsPageDeps = {
  projectsService: ProjectsService;
};

function createProjectsPageDeps(): ProjectsPageDeps {
  return { projectsService: createProjectsService(projectsRepository) };
}

export type ProjectsPageData = {
  projects: Project[];
};

export async function loadProjectsPage(
  deps: ProjectsPageDeps = createProjectsPageDeps(),
): Promise<ProjectsPageData> {
  const projects = await deps.projectsService.getAll();
  return { projects };
}
