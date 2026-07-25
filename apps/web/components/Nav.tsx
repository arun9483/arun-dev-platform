// Server component: no hydration cost on any route. Active-link state comes
// from the data-route attribute published by THEME_SCRIPT (matched in CSS), and
// the mobile menu is a native <details> disclosure rather than React state.

import Link from 'next/link';
import styles from './Nav.module.css';

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/articles', label: 'Articles' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/search', label: 'Search' },
] as const;

export function Nav() {
  return (
    <>
      <nav aria-label="Main navigation" className={styles.navDesktop}>
        <ul className={styles.list}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={styles.navLink} data-nav={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <details className={styles.mobileMenu}>
        <summary className={styles.hamburger} aria-label="Toggle menu">
          <MenuIcon className={styles.iconOpen} />
          <XIcon className={styles.iconClose} />
        </summary>

        <nav id="mobile-nav" aria-label="Mobile navigation" className={styles.mobileNav}>
          <ul className={styles.mobileList}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${styles.mobileLink}`}
                  data-nav={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    </>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
