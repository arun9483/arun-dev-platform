'use client';

import { useState } from 'react';
import { highlight } from 'sugar-high';
import { MermaidDiagram } from './MermaidDiagram';
import styles from './CodeBlock.module.css';

type Props = {
  lang?: string;
  rawCode?: string;
};

export function CodeBlock({ lang = 'code', rawCode = '' }: Props) {
  const [copied, setCopied] = useState(false);

  if (lang === 'mermaid') {
    return <MermaidDiagram chart={rawCode} />;
  }

  const highlighted = highlight(rawCode);

  const copy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{lang}</span>

        <button
          onClick={copy}
          className={styles.codeCopyBtn}
          data-copied={copied ? 'true' : 'false'}
          aria-label="Copy code to clipboard"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      <pre className={styles.codePre}>
        <code className={styles.codeMono} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
