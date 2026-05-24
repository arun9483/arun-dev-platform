'use client';

import { useState, useEffect } from 'react';
import type { Project } from '../types';
import { projectsService } from '../services/projectsService';
import type { ProjectFilter } from '../services/projectsService';

export type UseProjectsResult = {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
};

export function useProjects(filter?: ProjectFilter): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const tag = filter?.tag;
  const techStack = filter?.techStack;
  const featured = filter?.featured;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await projectsService.getAll({ tag, techStack, featured });
        if (!cancelled) setProjects(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load projects'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tag, techStack, featured]);

  return { projects, isLoading, error };
}
