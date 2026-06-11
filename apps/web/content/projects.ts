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
    createdAt: '2026-06-10T00:00:00Z',
    updatedAt: '2026-06-11T00:00:00Z',
    title: 'Design System Migration',
    description:
      'Extracted the design system into a standalone publishable monorepo and migrated the platform to consume it from npm.',
    problem:
      'The design system lived as private, unversioned workspace packages inside the platform monorepo — no build output, no releases, and unusable by any consumer outside the repo.',
    solution:
      'Extracted @arun-dev/tokens and @arun-dev/ui into the standalone arun-design-system Turborepo with dual ESM/CJS builds and an automated Changesets release pipeline publishing to npm. The export map mirrors the original workspace specifiers, so the platform migrated to the published 0.1.0 packages with zero app-code changes.',
    techStack: ['TypeScript', 'Turborepo', 'tsup', 'Changesets', 'GitHub Actions', 'pnpm'],
    impact: [
      { label: 'Packages published', value: '@arun-dev/tokens + @arun-dev/ui on npm' },
      { label: 'Migration cost', value: 'Zero app-code changes' },
      { label: 'Release automation', value: 'Changeset merge → npm publish' },
    ],
    links: {
      github: 'https://github.com/arun9483/arun-design-system',
      references: [
        {
          label: '@arun-dev/tokens on npm',
          url: 'https://www.npmjs.com/package/@arun-dev/tokens',
        },
        {
          label: '@arun-dev/ui on npm',
          url: 'https://www.npmjs.com/package/@arun-dev/ui',
        },
        {
          label: 'arun-design-system — standalone design system monorepo',
          url: 'https://github.com/arun9483/arun-design-system',
        },
        {
          label: 'arun-dev-platform — consumer platform monorepo',
          url: 'https://github.com/arun9483/arun-dev-platform',
        },
        {
          label: 'arun-dev-platform — deployed consumer application',
          url: 'https://arun-dev-platform-web.vercel.app',
        },
        {
          label: 'Before migration — arun-dev-platform@32cf676 (local workspace packages)',
          url: 'https://github.com/arun9483/arun-dev-platform/commit/32cf6762b0a8a1b6c69096ee3486bc6f8fada632',
        },
        {
          label: 'After migration — arun-dev-platform@4fa8ddb (published npm packages)',
          url: 'https://github.com/arun9483/arun-dev-platform/commit/4fa8ddba222c5f6506822e27df3c620b9351ef90',
        },
      ],
    },
    coverImage: '/images/placeholder-project.svg',
    metadata: {
      tags: ['design-system', 'monorepo', 'npm-publishing', 'tokens', 'white-label'],
      featured: true,
    },
  },
];
