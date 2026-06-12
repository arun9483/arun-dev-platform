import type { Project } from '../types';
import type { ProjectsRepository } from '../repositories/projectsRepository';
import type { SearchDocument } from '@/lib/search/types';

export type ProjectsService = {
  getAll: () => Promise<Project[]>;
  getBySlug: (slug: string) => Promise<Project | null>;
  getFeatured: () => Promise<Project[]>;
  getAllSlugs: () => Promise<string[]>;
  getSearchDocuments: () => Promise<SearchDocument[]>;
};

function projectToSearchDocument(project: Project): SearchDocument {
  return {
    // Namespaced by type: slugs are only unique within a content type, and the
    // search index requires globally unique document IDs.
    id: `project:${project.slug}`,
    type: 'project',
    href: `/projects/${project.slug}`,
    title: project.title,
    description: project.description,
    tags: project.metadata.tags.join(' '),
    techStack: project.techStack.join(' '),
  };
}

export function createProjectsService(repository: ProjectsRepository): ProjectsService {
  return {
    getAll: () => repository.findAll(),

    getBySlug: (slug) => repository.findBySlug(slug),

    getFeatured: async () => {
      const all = await repository.findAll();
      return all.filter((p) => p.metadata.featured === true);
    },

    getAllSlugs: async () => {
      const all = await repository.findAll();
      return all.map((p) => p.slug);
    },

    getSearchDocuments: async () => {
      const all = await repository.findAll();
      return all.map(projectToSearchDocument);
    },
  };
}
