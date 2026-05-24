import { describe, it, expect } from 'vitest';
import { createSearchIndex, search } from './searchIndex';
import type { SearchDocument } from './searchIndex';

const documents: SearchDocument[] = [
  {
    id: 'proj-1',
    type: 'project',
    title: 'Design System Migration',
    description: 'Migrated CSS Modules to Tailwind CSS with white-label support.',
    tags: 'design-system tailwind performance',
    techStack: 'React TypeScript Tailwind',
  },
  {
    id: 'art-1',
    type: 'article',
    title: 'React Server Components Deep Dive',
    description: 'Understanding RSC and how they impact performance.',
    tags: 'react rsc next.js performance',
  },
  {
    id: 'art-2',
    type: 'article',
    title: 'Building Performant Web Apps',
    description: 'Core Web Vitals, bundle analysis, and optimization techniques.',
    tags: 'performance lighthouse next.js',
  },
];

describe('searchIndex', () => {
  const index = createSearchIndex(documents);

  it('returns results matching the title', () => {
    const results = search(index, 'design system');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('proj-1');
  });

  it('returns results matching a tag', () => {
    const results = search(index, 'performance');
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('returns empty array for empty query', () => {
    const results = search(index, '');
    expect(results).toHaveLength(0);
  });

  it('returns empty array for whitespace-only query', () => {
    const results = search(index, '   ');
    expect(results).toHaveLength(0);
  });

  it('supports prefix search', () => {
    const results = search(index, 'perform');
    expect(results.length).toBeGreaterThan(0);
  });

  it('result includes type field', () => {
    const results = search(index, 'react');
    expect(results[0].type).toBeDefined();
  });
});
