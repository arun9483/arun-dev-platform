'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './MermaidDiagram.module.css';

type Props = {
  chart: string;
};

type Status = 'loading' | 'done' | 'error';

export function MermaidDiagram({ chart }: Props) {
  const rawId = useId();
  const diagramId = `mermaid${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled) return;

      const css = getComputedStyle(document.documentElement);
      const token = (v: string) => css.getPropertyValue(v).trim();

      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        fontFamily: 'inherit',
        fontSize: 13,
        flowchart: { curve: 'basis', padding: 24 },
        themeVariables: {
          primaryColor: token('--color-bg-accent'),
          primaryTextColor: token('--color-text-primary'),
          primaryBorderColor: token('--color-border-accent'),
          lineColor: token('--color-text-accent'),
          secondaryColor: token('--color-bg-surface'),
          tertiaryColor: token('--color-bg-secondary'),
          fontFamily: 'inherit',
        },
      });

      mermaid
        .render(diagramId, chart.trim())
        .then(({ svg }) => {
          if (cancelled) return;
          const el = ref.current;
          /* v8 ignore next */
          if (!el) return;
          el.innerHTML = svg;
          const svgEl = el.querySelector('svg');
          if (svgEl) {
            svgEl.removeAttribute('height');
            svgEl.setAttribute('width', '100%');
          }
          setStatus('done');
        })
        .catch(() => {
          if (!cancelled) setStatus('error');
        });
    });

    return () => {
      cancelled = true;
    };
  }, [chart, diagramId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className="chip chip-accent">diagram</span>
      </div>

      <div className={styles.body}>
        {status === 'loading' && (
          <div className={styles.loading}>
            <span>Rendering diagram…</span>
          </div>
        )}
        {status === 'error' && <div className={styles.error}>Failed to render diagram.</div>}
        <div ref={ref} className={styles.diagram} />
      </div>
    </div>
  );
}
