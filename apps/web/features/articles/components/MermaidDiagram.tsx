'use client';

import { useEffect, useId, useRef, useState } from 'react';

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
          if (cancelled || !ref.current) return;
          ref.current.innerHTML = svg;
          // Make SVG responsive
          const svgEl = ref.current.querySelector('svg');
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
    <div className="my-6 rounded-xl overflow-hidden border-default bg-surface">
      {/* Diagram label bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b-default bg-primary">
        <span className="chip chip-accent">diagram</span>
      </div>

      <div className="px-6 py-6">
        {status === 'loading' && (
          <div className="flex items-center justify-center py-8 gap-2 text-muted">
            <span className="text-sm">Rendering diagram…</span>
          </div>
        )}
        {status === 'error' && (
          <div className="text-sm rounded-lg px-4 py-3 bg-error-subtle text-error">
            Failed to render diagram.
          </div>
        )}
        <div ref={ref} className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto" />
      </div>
    </div>
  );
}
