import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./MermaidDiagram', () => ({
  MermaidDiagram: ({ chart }: { chart: string }) => <div data-testid="mermaid">{chart}</div>,
}));

import { CodeBlock } from './CodeBlock';

const writeText = vi.fn();
Object.assign(navigator, { clipboard: { writeText } });

describe('CodeBlock', () => {
  beforeEach(() => {
    writeText.mockClear();
    vi.useFakeTimers();
  });

  it('renders the language label', () => {
    render(<CodeBlock lang="typescript" rawCode="const x = 1;" />);
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('falls back to "code" when no lang prop is provided', () => {
    render(<CodeBlock rawCode="plain text" />);
    expect(screen.getByText('code')).toBeInTheDocument();
  });

  it('renders highlighted code inside a <code> element', () => {
    const { container } = render(<CodeBlock lang="ts" rawCode="const x = 1;" />);
    expect(container.querySelector('pre code')).not.toBeNull();
  });

  it('renders MermaidDiagram for mermaid language', () => {
    render(<CodeBlock lang="mermaid" rawCode="graph TD; A-->B;" />);
    expect(screen.getByTestId('mermaid')).toBeInTheDocument();
  });

  it('copies the raw code to the clipboard and toggles the button label', () => {
    render(<CodeBlock lang="ts" rawCode={`const greeting = "hi";`} />);
    const button = screen.getByRole('button', { name: /copy code to clipboard/i });
    expect(button).toHaveTextContent('Copy');

    fireEvent.click(button);
    expect(writeText).toHaveBeenCalledWith('const greeting = "hi";');
    expect(button).toHaveTextContent('✓ Copied');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(button).toHaveTextContent('Copy');
  });
});
