'use client';

import { useState, useEffect } from 'react';
import { getStoredTheme, applyTheme } from '@/styles/themes/theme-script';
import type { ThemeValue } from '@/styles/themes/theme-script';

const NEXT_THEME: Record<ThemeValue, ThemeValue> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const ARIA_LABEL: Record<ThemeValue, string> = {
  system: 'Switch to light theme',
  light: 'Switch to dark theme',
  dark: 'Switch to system theme',
};

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeValue>('system');

  useEffect(() => {
    const stored = getStoredTheme(localStorage);
    if (stored === 'dark' || stored === 'light') setTheme(stored);
  }, []);

  function handleClick() {
    const next = NEXT_THEME[theme];
    setTheme(next);
    if (next === 'system') {
      localStorage.removeItem('theme');
      applyTheme(document.documentElement, null);
    } else {
      localStorage.setItem('theme', next);
      applyTheme(document.documentElement, next);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ARIA_LABEL[theme]}
      title={ARIA_LABEL[theme]}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-colors"
    >
      {theme === 'system' && <MonitorIcon />}
      {theme === 'light' && <SunIcon />}
      {theme === 'dark' && <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
