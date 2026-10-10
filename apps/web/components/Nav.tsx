// The desktop links render on the server: no hydration cost there. Active-link state comes from
// the data-route attribute published by THEME_SCRIPT (matched in CSS). On narrow screens the menu
// is MobileNav, the design system's Drawer — the one client part of the navigation.

import NextLink from 'next/link';
import { Link } from '@arun-dev/ui';
import { MobileNav } from './MobileNav';
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
        <ul role="list" className={styles.list}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link render={<NextLink href={href} />} className={styles.navLink} data-nav={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <MobileNav links={NAV_LINKS} />
    </>
  );
}
