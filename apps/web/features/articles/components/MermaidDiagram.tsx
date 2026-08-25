'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from './MermaidDiagram.module.css';
import { Chip } from '@arun-dev/ui';

type Props = {
  chart: string;
};

type Status = 'loading' | 'done' | 'error';

export function MermaidDiagram({ chart }: Props) {
  const rawId = useId();
  const diagramId = `mermaid${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [visible, setVisible] = useState(false);

  // Defer the ~2MB mermaid import + render until the diagram approaches the
  // viewport — keeps its main-thread cost out of the TBT window on page load.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const el = wrapperRef.current;
    /* v8 ignore next */
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
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
  }, [visible, chart, diagramId]);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.header}>
        <Chip variant="accent">diagram</Chip>
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
