import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const initialize = vi.fn();
const render$ = vi.fn();

vi.mock('mermaid', () => ({
  default: {
    initialize: (...args: unknown[]) => initialize(...args),
    render: (...args: unknown[]) => render$(...args),
  },
}));

import { MermaidDiagram } from './MermaidDiagram';

describe('MermaidDiagram', () => {
  beforeEach(() => {
    initialize.mockClear();
    render$.mockReset();
  });

  it('renders the "diagram" chip label', () => {
    render$.mockResolvedValue({ svg: '<svg></svg>' });
    render(<MermaidDiagram chart="graph TD; A-->B;" />);
    expect(screen.getByText('diagram')).toBeInTheDocument();
  });

  it('shows the loading message before mermaid resolves', () => {
    render$.mockReturnValue(new Promise(() => {})); // never resolves
    render(<MermaidDiagram chart="graph TD; A-->B;" />);
    expect(screen.getByText(/Rendering diagram/)).toBeInTheDocument();
  });

  it('clears the loading message after a successful render', async () => {
    render$.mockResolvedValue({ svg: '<svg></svg>' });
    render(<MermaidDiagram chart="graph TD; A-->B;" />);
    await waitFor(() => {
      expect(screen.queryByText(/Rendering diagram/)).not.toBeInTheDocument();
    });
    expect(initialize).toHaveBeenCalled();
  });

  it('shows the error message when mermaid render fails', async () => {
    render$.mockRejectedValue(new Error('boom'));
    render(<MermaidDiagram chart="invalid syntax" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to render diagram/)).toBeInTheDocument();
    });
  });

  it('does not crash when the rendered output has no <svg> root element', async () => {
    render$.mockResolvedValue({ svg: '<div>no-svg-here</div>' });
    render(<MermaidDiagram chart="weird-output" />);
    await waitFor(() => {
      expect(screen.queryByText(/Rendering diagram/)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(/Failed to render diagram/)).not.toBeInTheDocument();
  });

  it('returns early when the component unmounts before render resolves (cancelled path)', async () => {
    let resolve: (value: { svg: string }) => void = () => {};
    render$.mockReturnValue(
      new Promise<{ svg: string }>((r) => {
        resolve = r;
      }),
    );
    const { unmount, container } = render(<MermaidDiagram chart="graph TD; A-->B;" />);

    // Let the dynamic import chain reach mermaid.render()
    await waitFor(() => expect(render$).toHaveBeenCalled());

    unmount();
    resolve({ svg: '<svg data-testid="should-not-appear"></svg>' });
    // Flush remaining microtasks
    await new Promise((r) => setTimeout(r, 0));

    expect(container.querySelector('[data-testid="should-not-appear"]')).toBeNull();
  });
});
