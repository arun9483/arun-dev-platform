import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MobileNav } from './MobileNav';

// jsdom has no showModal(), so the drawer is never shown here: its state is read from the
// data-open / data-closed attributes the design system's Drawer sets, on its <dialog>, which
// jsdom does not expose by role either. Opening it for real, and navigating from it, is covered
// by tests/e2e/mobile-nav.e2e.spec.ts.

const LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/articles', label: 'Articles' },
] as const;

const drawer = () => document.querySelector('dialog');
const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

describe('MobileNav', () => {
  it('starts closed, behind a button that names what it opens', () => {
    render(<MobileNav links={LINKS} />);
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    expect(drawer()).toHaveAttribute('data-closed');
  });

  it('opens on the button', () => {
    render(<MobileNav links={LINKS} />);
    openMenu();
    expect(drawer()).toHaveAttribute('data-open');
  });

  it('lists every link, marked for the active-route styles', () => {
    render(<MobileNav links={LINKS} />);
    const link = screen.getByRole('link', { name: 'Articles', hidden: true });
    expect(link).toHaveAttribute('href', '/articles');
    expect(link).toHaveAttribute('data-nav', '/articles');
  });

  it('closes as a link is followed', () => {
    render(<MobileNav links={LINKS} />);
    openMenu();
    fireEvent.click(screen.getByRole('link', { name: 'Projects', hidden: true }));
    expect(drawer()).toHaveAttribute('data-closed');
  });

  it('closes from its own close button', () => {
    render(<MobileNav links={LINKS} />);
    openMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Close menu', hidden: true }));
    expect(drawer()).toHaveAttribute('data-closed');
  });
});
