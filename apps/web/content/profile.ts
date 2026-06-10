import type { Profile } from '../features/profile/types';

export const profile: Profile = {
  id: 'arun-tripathi',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2026-05-24T00:00:00Z',
  name: 'Arun Tripathi',
  title: 'Senior Frontend Engineer',
  summary:
    'Frontend engineer with a focus on performance, scalability, and developer experience. I build agent-first platforms, design systems, and high-quality web applications that serve millions of users.',
  location: 'India',
  socialLinks: {
    github: 'https://github.com/arun9483',
    linkedin: 'https://linkedin.com/in/arunkumartripathi',
    website: 'https://arun-dev-platform-web.vercel.app/',
  },
  skills: [
    { name: 'React', category: 'frontend', level: 'expert' },
    { name: 'Next.js', category: 'frontend', level: 'expert' },
    { name: 'TypeScript', category: 'frontend', level: 'expert' },
    { name: 'CSS Architecture', category: 'frontend', level: 'advanced' },
    { name: 'Web Performance', category: 'frontend', level: 'advanced' },
    { name: 'Node.js', category: 'backend', level: 'advanced' },
    { name: 'GraphQL', category: 'backend', level: 'intermediate' },
    { name: 'Turborepo', category: 'tools', level: 'advanced' },
    { name: 'Vitest', category: 'tools', level: 'advanced' },
    { name: 'Playwright', category: 'tools', level: 'intermediate' },
  ],
  experience: [
    {
      company: 'Acme Corp',
      role: 'Senior Frontend Engineer',
      startDate: '2022-01',
      highlights: [
        'Led design system migration to CSS custom properties and design tokens — reduced bundle by 34%',
        'Built agent-first developer platform serving 200k monthly active users',
        'Achieved Lighthouse score of 99 across all core pages',
      ],
      techStack: ['React', 'Next.js', 'TypeScript', 'CSS Modules', 'Turborepo'],
    },
    {
      company: 'Beta Inc',
      role: 'Frontend Engineer',
      startDate: '2019-06',
      endDate: '2021-12',
      highlights: [
        'Rebuilt checkout flow — improved conversion rate by 18%',
        'Introduced Vitest and achieved 90% test coverage on critical paths',
      ],
      techStack: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
    },
  ],
};
