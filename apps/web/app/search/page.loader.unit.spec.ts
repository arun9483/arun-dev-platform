import { describe, it, expect, vi } from 'vitest';
import { loadSearchPage, toSearchDocuments } from './page.loader';
import type { ProjectsService } from '@/features/projects/services/projectsService';
import type { ArticlesService } from '@/features/articles/services/articlesService';
import type { Project } from '@/features/projects/types';
import type { ArticleMeta } from '@/features/articles/types';

const mockProject: Project = {
  id: 'p1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  slug: 'platform-rebuild',
  title: 'Platform Rebuild',
  description: 'Rebuilt the core platform with microservices.',
  problem: 'Legacy monolith.',
  solution: 'Microservices architecture.',
  techStack: ['React', 'TypeScript', 'Node.js'],
  impact: [{ label: 'Latency', value: '-40%' }],
  links: { github: 'https://github.com/example/repo' },
  metadata: { tags: ['web', 'performance'], featured: true },
};

const mockArticle: ArticleMeta = {
  id: 'ar1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  slug: 'react-server-components',
  title: 'React Server Components Deep Dive',
  summary: 'A deep dive into React Server Components.',
  publishedAt: '2024-03-01T00:00:00Z',
  metadata: {
    tags: ['react', 'performance'],
    category: 'frontend',
    difficulty: 'advanced',
    readTime: 12,
    featured: true,
  },
};

const mockDeps = {
  projectsService: {
    getAll: vi.fn(async () => [mockProject]),
    getBySlug: vi.fn(),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn(),
  } satisfies ProjectsService,
  articlesService: {
    getAll: vi.fn(async () => [mockArticle]),
    getBySlug: vi.fn(),
    getFeatured: vi.fn(),
    getAllSlugs: vi.fn(),
  } satisfies ArticlesService,
};

describe('toSearchDocuments', () => {
  it('maps projects to search documents using slug as id', () => {
    const docs = toSearchDocuments([mockProject], []);
    expect(docs).toHaveLength(1);
    expect(docs[0]).toEqual({
      id: 'platform-rebuild',
      type: 'project',
      title: 'Platform Rebuild',
      description: 'Rebuilt the core platform with microservices.',
      tags: 'web performance',
      techStack: 'React TypeScript Node.js',
    });
  });

  it('maps articles to search documents using slug as id', () => {
    const docs = toSearchDocuments([], [mockArticle]);
    expect(docs).toHaveLength(1);
    expect(docs[0]).toEqual({
      id: 'react-server-components',
      type: 'article',
      title: 'React Server Components Deep Dive',
      description: 'A deep dive into React Server Components.',
      tags: 'react performance',
    });
  });

  it('combines projects and articles — projects listed first', () => {
    const docs = toSearchDocuments([mockProject], [mockArticle]);
    expect(docs).toHaveLength(2);
    expect(docs[0].type).toBe('project');
    expect(docs[1].type).toBe('article');
  });

  it('returns empty array when both inputs are empty', () => {
    expect(toSearchDocuments([], [])).toEqual([]);
  });
});

describe('loadSearchPage', () => {
  it('fetches projects and articles concurrently and returns mapped documents', async () => {
    const data = await loadSearchPage(mockDeps);
    expect(mockDeps.projectsService.getAll).toHaveBeenCalledWith();
    expect(mockDeps.articlesService.getAll).toHaveBeenCalledWith();
    expect(data.documents).toHaveLength(2);
    expect(data.documents.map((d) => d.type)).toEqual(['project', 'article']);
  });

  it('returns documents with correct slugs as ids', async () => {
    const data = await loadSearchPage(mockDeps);
    expect(data.documents[0].id).toBe('platform-rebuild');
    expect(data.documents[1].id).toBe('react-server-components');
  });
});
