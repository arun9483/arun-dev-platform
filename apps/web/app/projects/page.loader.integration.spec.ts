import { describe, it, expect } from 'vitest';

import { loadProjectsPage } from './page.loader';

// Integration: loader → service → repository → real structured project content.
describe('loadProjectsPage (integration)', () => {
  it('loads the real projects from the content source', async () => {
    const { projects } = await loadProjectsPage();

    expect(projects.length).toBeGreaterThan(0);
    const slugs = projects.map((project) => project.slug);
    expect(slugs).toContain('arun-dev-platform');
  });

  it('returns fully populated project entities', async () => {
    const { projects } = await loadProjectsPage();

    for (const project of projects) {
      expect(project.slug).toBeTruthy();
      expect(project.title).toBeTruthy();
    }
  });
});
