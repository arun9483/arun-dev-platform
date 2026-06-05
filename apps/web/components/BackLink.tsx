import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
};

export function BackLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="link-back hover:opacity-75 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-accent)] focus-visible:ring-offset-1"
    >
      ← {children}
    </Link>
  );
}
