import { describe, it, expect } from 'vitest';
import { projectsRepository } from './projectsRepository';

describe('projectsRepository', () => {
  it('returns the bundled project list', async () => {
    const all = await projectsRepository.findAll();
    expect(Array.isArray(all)).toBe(true);
  });

  it('returns a project by slug when it exists', async () => {
    const all = await projectsRepository.findAll();
    if (all.length === 0) return;
    const found = await projectsRepository.findBySlug(all[0].slug);
    expect(found).not.toBeNull();
    expect(found?.slug).toBe(all[0].slug);
  });

  it('returns null when the slug does not exist', async () => {
    const found = await projectsRepository.findBySlug('definitely-not-a-real-slug-xyz');
    expect(found).toBeNull();
  });
});
