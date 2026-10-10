import NextLink from 'next/link';
import { Link } from '@arun-dev/ui';
import type { ReactNode } from 'react';
import styles from './BackLink.module.css';

type Props = {
  href: string;
  children: ReactNode;
};

export function BackLink({ href, children }: Props) {
  return (
    <Link render={<NextLink href={href} />} className={styles.linkBack}>
      ← {children}
    </Link>
  );
}
