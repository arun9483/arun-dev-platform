import { describe, it, expect } from 'vitest';

import { loadArticlesPage } from './page.loader';

// Integration: loader → service → repository → real MDX content on disk.
describe('loadArticlesPage (integration)', () => {
  it('loads the real articles from the content directory', async () => {
    const { articles } = await loadArticlesPage();

    expect(articles.length).toBeGreaterThan(0);
    const slugs = articles.map((article) => article.slug);
    expect(slugs).toContain('react-server-components-deep-dive');
  });

  it('returns fully populated article metadata', async () => {
    const { articles } = await loadArticlesPage();

    for (const article of articles) {
      expect(article.slug).toBeTruthy();
      expect(article.title).toBeTruthy();
    }
  });
});
