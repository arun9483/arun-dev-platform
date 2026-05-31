import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeSwitcher', () => {
  it('defaults to system state when localStorage is empty', () => {
    render(<ThemeSwitcher />);
    const btn = screen.getByRole('button', { name: 'Switch to light theme' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('title', 'Switch to light theme');
  });

  it('reads dark from localStorage on mount', async () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeSwitcher />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch to system theme' })).toBeInTheDocument(),
    );
  });

  it('reads light from localStorage on mount', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeSwitcher />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument(),
    );
  });

  it('cycles system → light: sets localStorage and data-theme', async () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument(),
    );
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('cycles light → dark: updates localStorage and data-theme', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeSwitcher />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch to system theme' })).toBeInTheDocument(),
    );
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('cycles dark → system: clears localStorage and removes data-theme', async () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    render(<ThemeSwitcher />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch to system theme' })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument(),
    );
    expect(localStorage.getItem('theme')).toBeNull();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
