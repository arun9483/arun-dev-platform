'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Button, Drawer, Link } from '@arun-dev/ui';
import styles from './Nav.module.css';

type Props = {
  links: readonly { href: string; label: string }[];
};

/**
 * The menu on narrow screens: the design system's Drawer, from the left, with its focus trap,
 * Esc, backdrop and swipe to close. A link closes it as it navigates.
 */
export function MobileNav({ links }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.mobileMenu}>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger
          render={<Button variant="ghost" className={styles.hamburger} aria-label="Open menu" />}
        >
          <MenuIcon />
        </Drawer.Trigger>
        <Drawer.Popup side="left">
          <div className={styles.drawerHeader}>
            <Drawer.Title>Menu</Drawer.Title>
            <Drawer.Close
              render={
                <Button variant="ghost" className={styles.hamburger} aria-label="Close menu" />
              }
            >
              <XIcon />
            </Drawer.Close>
          </div>
          <nav aria-label="Mobile navigation">
            <ul role="list" className={styles.mobileList}>
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    render={<NextLink href={href} />}
                    className={`${styles.navLink} ${styles.mobileLink}`}
                    data-nav={href}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Drawer.Popup>
      </Drawer.Root>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
