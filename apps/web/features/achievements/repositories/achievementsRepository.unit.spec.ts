import { describe, it, expect } from 'vitest';
import { achievementsRepository } from './achievementsRepository';

describe('achievementsRepository', () => {
  it('returns the bundled achievement list from content', async () => {
    const all = await achievementsRepository.findAll();
    expect(Array.isArray(all)).toBe(true);
  });
});
