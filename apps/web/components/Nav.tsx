'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/articles', label: 'Articles' },
  { href: '/search', label: 'Search' },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} className="nav-link" data-active={isActive ? 'true' : 'false'}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
