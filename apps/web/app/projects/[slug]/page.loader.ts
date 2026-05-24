import { projectsRepository } from '@/features/projects/repositories/projectsRepository';
import { createProjectsService } from '@/features/projects/services/projectsService';
import type { ProjectsService } from '@/features/projects/services/projectsService';
import type { Project } from '@/features/projects/types';

type ProjectDetailDeps = {
  projectsService: ProjectsService;
};

function createProjectDetailDeps(): ProjectDetailDeps {
  return { projectsService: createProjectsService(projectsRepository) };
}

export type ProjectDetailData = {
  project: Project;
};

export async function loadProjectSlugs(
  deps: ProjectDetailDeps = createProjectDetailDeps(),
): Promise<string[]> {
  return deps.projectsService.getAllSlugs();
}

export async function loadProjectDetail(
  slug: string,
  deps: ProjectDetailDeps = createProjectDetailDeps(),
): Promise<ProjectDetailData | null> {
  const project = await deps.projectsService.getBySlug(slug);
  if (!project) return null;
  return { project };
}
