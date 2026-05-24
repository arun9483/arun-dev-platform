/**
 * FOUC prevention theme logic.
 *
 * getStoredTheme / applyTheme are exported as pure functions for unit testing.
 * THEME_SCRIPT is the minified string inlined into <head> via dangerouslySetInnerHTML.
 *
 * Valid stored values: 'dark' | 'light'
 * Any other value (null, 'system', unknown) defers to the CSS media query.
 */

export type ThemeValue = 'dark' | 'light' | 'system';

export function getStoredTheme(storage: Pick<Storage, 'getItem'>): string | null {
  try {
    return storage.getItem('theme');
  } catch {
    return null;
  }
}

export function applyTheme(element: HTMLElement, theme: string | null): void {
  if (theme === 'dark' || theme === 'light') {
    element.setAttribute('data-theme', theme);
  } else {
    element.removeAttribute('data-theme');
  }
}

export const THEME_SCRIPT =
  `(function(){try{var t=localStorage.getItem('theme');` +
  `if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}` +
  `catch(e){}})();`;
