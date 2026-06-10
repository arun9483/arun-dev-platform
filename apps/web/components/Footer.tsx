import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>© {year} Arun Tripathi</span>
        <nav aria-label="Footer navigation" className={styles.nav}>
          <Link href="/projects" className={styles.link}>
            Projects
          </Link>
          <Link href="/articles" className={styles.link}>
            Articles
          </Link>
          <Link href="/achievements" className={styles.link}>
            Achievements
          </Link>
        </nav>
        <span>Built with Next.js · TypeScript</span>
      </div>
    </footer>
  );
}
