import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';

import { Header } from './Header';

// Integration: the header composes the server-rendered desktop nav, the client MobileNav (the
// design system's Drawer) and the ThemeSwitcher. Both navs must offer the same destinations, each
// marked for the active-route styles that key off <html data-route>.
describe('header navigation (integration)', () => {
  const DESTINATIONS = ['/projects', '/articles', '/achievements', '/search'];

  it('offers the same destinations on desktop and in the mobile menu', () => {
    render(<Header />);
    const desktop = screen.getByRole('navigation', { name: 'Main navigation' });
    const mobile = screen.getByRole('navigation', { name: 'Mobile navigation', hidden: true });

    for (const nav of [desktop, mobile]) {
      const links = within(nav).getAllByRole('link', { hidden: true });
      expect(links.map((link) => link.getAttribute('href'))).toEqual(DESTINATIONS);
      expect(links.map((link) => link.getAttribute('data-nav'))).toEqual(DESTINATIONS);
    }
  });

  it('lays the lists out as lists, without markers', () => {
    render(<Header />);
    for (const name of ['Main navigation', 'Mobile navigation']) {
      const nav = screen.getByRole('navigation', { name, hidden: true });
      expect(within(nav).getByRole('list', { hidden: true })).toHaveAttribute('role', 'list');
    }
  });

  it('puts the menu and the theme behind named buttons', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to .* theme/ })).toBeInTheDocument();
  });
});
