import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './BackLink.module.css';

type Props = {
  href: string;
  children: ReactNode;
};

export function BackLink({ href, children }: Props) {
  return (
    <Link href={href} className={styles.linkBack}>
      ← {children}
    </Link>
  );
}
