import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
};

export function BackLink({ href, children }: Props) {
  return (
    <Link href={href} className="link-back hover:opacity-75">
      ← {children}
    </Link>
  );
}
