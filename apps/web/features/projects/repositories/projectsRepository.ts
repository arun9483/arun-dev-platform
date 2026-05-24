import type { Project } from '../types';
import { projects } from '../../../content/projects';

export type ProjectsRepository = {
  findAll: () => Promise<Project[]>;
  findBySlug: (slug: string) => Promise<Project | null>;
};

export const projectsRepository: ProjectsRepository = {
  findAll: async () => projects,
  findBySlug: async (slug) => projects.find((p) => p.slug === slug) ?? null,
};
