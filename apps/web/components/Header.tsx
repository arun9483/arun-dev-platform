import { Suspense } from 'react';
import Link from 'next/link';
import { Nav } from './Nav';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          arun.dev
        </Link>
        <div className={styles.actions}>
          {/* Suspense boundaries make each island its own selective-hydration
              unit, so hydration runs as short tasks instead of one long one. */}
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
          <Suspense fallback={null}>
            <ThemeSwitcher />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
