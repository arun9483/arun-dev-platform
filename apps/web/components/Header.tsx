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
          <Nav />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
