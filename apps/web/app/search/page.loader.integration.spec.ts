import { describe, it, expect } from 'vitest';

import { loadSearchPage } from './page.loader';

// Integration: search loader aggregates documents from the real projects and
// articles services (cross-feature data flow through the agent search service).
describe('loadSearchPage (integration)', () => {
  it('aggregates searchable documents from all content sources', async () => {
    const { documents } = await loadSearchPage();

    expect(documents.length).toBeGreaterThan(0);
    const serialized = JSON.stringify(documents);
    expect(serialized).toContain('arun-dev-platform');
    expect(serialized).toContain('react-server-components-deep-dive');
  });
});
