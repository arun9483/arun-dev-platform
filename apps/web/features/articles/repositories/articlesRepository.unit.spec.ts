import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';
import { articlesRepository } from './articlesRepository';

describe('articlesRepository', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('findAll', () => {
    it('returns parsed article meta when the content directory exists', async () => {
      const all = await articlesRepository.findAll();
      expect(Array.isArray(all)).toBe(true);
      if (all.length > 0) {
        expect(typeof all.at(0)?.slug).toBe('string');
        expect(typeof all.at(0)?.title).toBe('string');
      }
    });

    it('returns an empty array when the content directory is missing', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const all = await articlesRepository.findAll();
      expect(all).toEqual([]);
    });
  });

  describe('findBySlug', () => {
    it('returns article with content when slug exists', async () => {
      const slugs = await articlesRepository.findAllSlugs();
      const slug = slugs.at(0);
      if (slug === undefined) return;
      const article = await articlesRepository.findBySlug(slug);
      expect(article).not.toBeNull();
      expect(article?.content).toBeDefined();
    });

    it('returns null when the file does not exist', async () => {
      const article = await articlesRepository.findBySlug('definitely-not-real-slug-xyz');
      expect(article).toBeNull();
    });
  });

  describe('findAllSlugs', () => {
    it('returns the list of slugs from the content directory', async () => {
      const slugs = await articlesRepository.findAllSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      slugs.forEach((s) => expect(typeof s).toBe('string'));
    });

    it('returns an empty array when the content directory is missing', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const slugs = await articlesRepository.findAllSlugs();
      expect(slugs).toEqual([]);
    });
  });

  describe('parseArticleMeta defaults', () => {
    it('applies defaults when frontmatter is empty', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue('---\n---\n# Body');
      const article = await articlesRepository.findBySlug('empty-frontmatter');
      expect(article).not.toBeNull();
      expect(article?.id).toBe('empty-frontmatter');
      expect(article?.title).toBe('');
      expect(article?.summary).toBe('');
      expect(article?.publishedAt).toBe('');
      expect(article?.createdAt).toBe('');
      expect(article?.updatedAt).toBe('');
      expect(article?.coverImage).toBeUndefined();
      expect(article?.metadata).toEqual({
        tags: [],
        category: '',
        difficulty: 'beginner',
        readTime: 0,
        featured: false,
      });
    });

    it('preserves explicit frontmatter values', async () => {
      const frontmatter = [
        '---',
        'id: explicit-id',
        'title: Title',
        'summary: Summary',
        'publishedAt: 2026-01-01',
        'createdAt: 2026-01-02',
        'updatedAt: 2026-01-03',
        'coverImage: /cover.png',
        'tags: [a, b]',
        'category: frontend',
        'difficulty: advanced',
        'readTime: 12',
        'featured: true',
        '---',
        '# Body',
      ].join('\n');
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(frontmatter);
      const article = await articlesRepository.findBySlug('full');
      expect(article?.id).toBe('explicit-id');
      expect(article?.title).toBe('Title');
      expect(article?.coverImage).toBe('/cover.png');
      expect(article?.metadata.tags).toEqual(['a', 'b']);
      expect(article?.metadata.difficulty).toBe('advanced');
      expect(article?.metadata.readTime).toBe(12);
      expect(article?.metadata.featured).toBe(true);
    });
  });
});
