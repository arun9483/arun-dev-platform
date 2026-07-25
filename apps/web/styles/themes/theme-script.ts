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

// Also publishes the current path as data-route on <html> so the nav can show
// its active link in pure CSS — that keeps Nav a server component with no
// hydration cost. history is patched (not polled) so client-side navigations
// update it too.
export const THEME_SCRIPT =
  `(function(){try{var t=localStorage.getItem('theme');` +
  `if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}` +
  `catch(e){}` +
  `function r(){document.documentElement.setAttribute('data-route',location.pathname)}r();` +
  `var p=history.pushState;history.pushState=function(){p.apply(this,arguments);r()};` +
  `var q=history.replaceState;history.replaceState=function(){q.apply(this,arguments);r()};` +
  `addEventListener('popstate',r)})();`;
