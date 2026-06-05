import Link from 'next/link';

const footerLinkClass =
  'hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-accent)] focus-visible:ring-offset-1';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-default bg-primary mt-auto">
      <div className="mx-auto max-w-4xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
        <span>© {year} Arun Tripathi</span>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <Link href="/projects" className={footerLinkClass}>
            Projects
          </Link>
          <Link href="/articles" className={footerLinkClass}>
            Articles
          </Link>
          <Link href="/achievements" className={footerLinkClass}>
            Achievements
          </Link>
        </nav>
        <span>Built with Next.js · Tailwind CSS 4 · TypeScript</span>
      </div>
    </footer>
  );
}
