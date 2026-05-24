import Link from 'next/link';
import { Nav } from './Nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary border-b border-default backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold tracking-tight text-accent">
          arun.dev
        </Link>
        <Nav />
      </div>
    </header>
  );
}
