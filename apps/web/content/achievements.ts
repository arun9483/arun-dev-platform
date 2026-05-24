import type { Achievement } from '../features/achievements/types';

export const achievements: Achievement[] = [
  {
    id: 'aws-ccp',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2023-09-01T00:00:00Z',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2023-09',
    type: 'certification',
    description:
      'Foundational certification validating cloud concepts, AWS core services, security, architecture, and pricing.',
    credentialUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    metadata: {
      tags: ['aws', 'cloud', 'certification'],
      featured: true,
    },
  },
  {
    id: 'performance-award-2023',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    title: 'Engineering Excellence Award',
    issuer: 'Acme Corp',
    date: '2023-12',
    type: 'award',
    description:
      'Awarded for delivering a 34% CSS bundle reduction and achieving Lighthouse 99 across all core pages.',
    metadata: {
      tags: ['performance', 'frontend', 'award'],
      featured: true,
    },
  },
  {
    id: 'open-source-contribution',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    title: 'Open Source Contributor — Next.js Docs',
    issuer: 'Vercel / Next.js',
    date: '2024-03',
    type: 'contribution',
    description:
      'Contributed improvements to the Next.js App Router documentation covering RSC data-fetching patterns.',
    credentialUrl: 'https://github.com/vercel/next.js',
    metadata: {
      tags: ['open-source', 'next.js', 'docs'],
    },
  },
];
