'use client';

import { isValidElement, useState } from 'react';
import { highlight } from 'sugar-high';
import { MermaidDiagram } from './MermaidDiagram';

type Props = {
  children?: React.ReactNode;
};

export function CodeBlock({ children }: Props) {
  const [copied, setCopied] = useState(false);

  const codeEl = isValidElement(children)
    ? (children as React.ReactElement<{ className?: string; children?: string }>)
    : null;
  const className = codeEl?.props?.className ?? '';
  const language = className.replace('language-', '') || 'code';
  const rawCode = String(codeEl?.props?.children ?? '').trimEnd();

  if (language === 'mermaid') {
    return <MermaidDiagram chart={rawCode} />;
  }

  const highlighted = highlight(rawCode);

  const copy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block my-6 rounded-xl overflow-hidden">
      {/* Header: language left, copy right */}
      <div className="code-header flex items-center justify-between px-4 py-2.5">
        <span className="text-xs font-mono text-code-dim">{language}</span>

        {/* Fixed-width button — inline style is intentional: bg/color/border change on every click */}
        <button
          onClick={copy}
          className="text-xs px-2.5 py-1 rounded-md font-medium transition-all"
          style={{
            minWidth: '72px',
            textAlign: 'center',
            backgroundColor: copied ? 'var(--code-copied-bg)' : 'var(--code-copy-bg)',
            color: copied ? 'var(--code-copied-color)' : 'var(--code-text-dim)',
            border: `1px solid ${copied ? 'var(--code-copied-border)' : 'var(--code-border-dim)'}`,
          }}
          aria-label="Copy code to clipboard"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code area */}
      <pre className="code-pre overflow-x-auto px-5 py-5 text-sm leading-relaxed">
        <code className="font-mono" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
