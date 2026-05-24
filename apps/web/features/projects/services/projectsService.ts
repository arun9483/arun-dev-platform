import type { Project } from '../types';
import type { ProjectsRepository } from '../repositories/projectsRepository';
import { projectsRepository } from '../repositories/projectsRepository';

export type ProjectFilter = {
  tag?: string;
  techStack?: string;
  featured?: boolean;
};

export type ProjectsService = {
  getAll: (filter?: ProjectFilter) => Promise<Project[]>;
  getBySlug: (slug: string) => Promise<Project | null>;
  getFeatured: () => Promise<Project[]>;
  getAllSlugs: () => Promise<string[]>;
};

export function createProjectsService(repository: ProjectsRepository): ProjectsService {
  return {
    getAll: async (filter) => {
      const all = await repository.findAll();
      if (!filter) return all;

      return all.filter((project) => {
        if (filter.tag && !project.metadata.tags.includes(filter.tag)) return false;
        if (filter.techStack && !project.techStack.includes(filter.techStack)) return false;
        if (filter.featured !== undefined && project.metadata.featured !== filter.featured)
          return false;
        return true;
      });
    },

    getBySlug: (slug) => repository.findBySlug(slug),

    getFeatured: async () => {
      const all = await repository.findAll();
      return all.filter((p) => p.metadata.featured === true);
    },

    getAllSlugs: async () => {
      const all = await repository.findAll();
      return all.map((p) => p.slug);
    },
  };
}

export const projectsService = createProjectsService(projectsRepository);
