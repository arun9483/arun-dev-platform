import { describe, it, expect, vi } from 'vitest';
import { getStoredTheme, applyTheme, THEME_SCRIPT } from './theme-script';

describe('getStoredTheme', () => {
  it('returns the stored value when localStorage has a theme', () => {
    const storage = { getItem: vi.fn().mockReturnValue('dark') };
    expect(getStoredTheme(storage)).toBe('dark');
  });

  it('returns light when localStorage contains light', () => {
    const storage = { getItem: vi.fn().mockReturnValue('light') };
    expect(getStoredTheme(storage)).toBe('light');
  });

  it('returns null when localStorage has no stored theme', () => {
    const storage = { getItem: vi.fn().mockReturnValue(null) };
    expect(getStoredTheme(storage)).toBeNull();
  });

  it('returns null when localStorage throws (e.g. privacy mode)', () => {
    const storage = {
      getItem: vi.fn().mockImplementation(() => {
        throw new Error('SecurityError');
      }),
    };
    expect(getStoredTheme(storage)).toBeNull();
  });
});

describe('applyTheme', () => {
  it('sets data-theme="dark" when theme is dark', () => {
    const element = document.createElement('html');
    applyTheme(element, 'dark');
    expect(element.getAttribute('data-theme')).toBe('dark');
  });

  it('sets data-theme="light" when theme is light', () => {
    const element = document.createElement('html');
    applyTheme(element, 'light');
    expect(element.getAttribute('data-theme')).toBe('light');
  });

  it('removes data-theme when theme is null', () => {
    const element = document.createElement('html');
    element.setAttribute('data-theme', 'dark');
    applyTheme(element, null);
    expect(element.hasAttribute('data-theme')).toBe(false);
  });

  it('removes data-theme when theme is system', () => {
    const element = document.createElement('html');
    element.setAttribute('data-theme', 'dark');
    applyTheme(element, 'system');
    expect(element.hasAttribute('data-theme')).toBe(false);
  });

  it('removes data-theme for any unknown theme value', () => {
    const element = document.createElement('html');
    element.setAttribute('data-theme', 'light');
    applyTheme(element, 'unknown-value');
    expect(element.hasAttribute('data-theme')).toBe(false);
  });
});

describe('THEME_SCRIPT', () => {
  it('is a non-empty string', () => {
    expect(typeof THEME_SCRIPT).toBe('string');
    expect(THEME_SCRIPT.length).toBeGreaterThan(0);
  });

  it('applies dark theme when localStorage contains dark', () => {
    document.documentElement.removeAttribute('data-theme');
    const originalGetItem = localStorage.getItem.bind(localStorage);
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');

    new Function(THEME_SCRIPT)();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(originalGetItem);
    vi.restoreAllMocks();
  });

  it('applies light theme when localStorage contains light', () => {
    document.documentElement.removeAttribute('data-theme');
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');

    new Function(THEME_SCRIPT)();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    vi.restoreAllMocks();
  });

  it('does not set data-theme when localStorage has no theme', () => {
    document.documentElement.removeAttribute('data-theme');
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    new Function(THEME_SCRIPT)();

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    vi.restoreAllMocks();
  });

  it('does not throw when localStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(() => new Function(THEME_SCRIPT)()).not.toThrow();
    vi.restoreAllMocks();
  });
});
