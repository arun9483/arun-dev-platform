'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Nav.module.css';

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/articles', label: 'Articles' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/search', label: 'Search' },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav aria-label="Main navigation" className={styles.navDesktop}>
        <ul className={styles.list}>
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={styles.navLink}
                  data-active={isActive ? 'true' : 'false'}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        className={styles.hamburger}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <XIcon /> : <MenuIcon />}
      </button>

      {open && (
        <nav id="mobile-nav" aria-label="Main navigation" className={styles.mobileNav}>
          <ul className={styles.mobileList}>
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${styles.navLink} ${styles.mobileLink}`}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
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
