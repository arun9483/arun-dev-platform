import { describe, it, expect } from 'vitest';

import { loadHomePage } from './page.loader';

// Integration: home loader fans out to profile, projects, articles, and
// achievements services with real repositories and content.
describe('loadHomePage (integration)', () => {
  it('loads profile and featured content from real sources', async () => {
    const data = await loadHomePage();

    expect(data.profile).toBeTruthy();
    expect(data.featuredSkills.length).toBeGreaterThan(0);
    expect(data.featuredProjects.length).toBeGreaterThan(0);
    expect(data.featuredArticles.length).toBeGreaterThan(0);
    expect(data.featuredAchievements.length).toBeGreaterThan(0);
  });
});
