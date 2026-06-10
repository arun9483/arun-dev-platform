import type { Project } from '../features/projects/types';

export const projects: Project[] = [
  {
    id: 'arun-dev-platform',
    slug: 'arun-dev-platform',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-05-24T00:00:00Z',
    title: 'Arun Dev Platform',
    description:
      'An agent-first developer platform built as a high-performance, scalable monorepo showcasing engineering excellence.',
    problem:
      'Traditional portfolios are static and lack machine-readability, making it hard for AI systems or recruiters to extract structured insights quickly.',
    solution:
      'Built a feature-rich monorepo platform with Clean Architecture, agent-first data modeling, and a white-label design system — enabling both humans and AI to query and navigate content meaningfully.',
    techStack: ['Next.js', 'TypeScript', 'CSS Modules', 'Turborepo', 'Vitest', 'Playwright'],
    impact: [
      { label: 'Lighthouse score', value: '~100' },
      { label: 'Unit test coverage', value: '100% on Phase 0' },
      { label: 'Bundle size', value: 'Minimal JS (RSC-first)' },
    ],
    links: {
      github: 'https://github.com/arun9483/arun-dev-platform',
      live: 'https://arun.dev',
    },
    coverImage: '/images/placeholder-project.svg',
    metadata: {
      tags: ['platform', 'design-system', 'agent-first', 'monorepo', 'performance'],
      featured: true,
    },
  },
  {
    id: 'design-system-migration',
    slug: 'design-system-migration',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
    title: 'Design System Migration',
    description:
      'Led end-to-end migration of a legacy design system to CSS custom properties with white-label support.',
    problem:
      'Existing design system had inconsistent tokens, no theme support, and a 120 KB CSS bundle causing poor Lighthouse scores.',
    solution:
      'Introduced CSS custom properties as a token layer, migrated components to semantic utility classes, and implemented a brand/theme switching architecture — all without breaking existing consumers.',
    techStack: ['CSS Custom Properties', 'TypeScript', 'React', 'Storybook'],
    impact: [
      { label: 'CSS bundle reduction', value: '34%' },
      { label: 'Lighthouse CSS score', value: '+18 points' },
      { label: 'Token consistency', value: '100% of components migrated' },
    ],
    links: {},
    coverImage: '/images/placeholder-project.svg',
    metadata: {
      tags: ['design-system', 'performance', 'css-tokens', 'tokens', 'white-label'],
      featured: true,
    },
  },
];
