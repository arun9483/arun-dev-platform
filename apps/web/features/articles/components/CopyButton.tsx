'use client';

import { useState } from 'react';
import { Button } from '@arun-dev/ui';
import styles from './CodeBlock.module.css';

type Props = {
  rawCode: string;
};

export function CopyButton({ rawCode }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      onClick={copy}
      className={styles.codeCopyBtn}
      data-copied={copied ? 'true' : 'false'}
      aria-label="Copy code to clipboard"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </Button>
  );
}
