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

  it('renders the language label from the child className', () => {
    render(
      <CodeBlock>
        <code className="language-typescript">const x = 1;</code>
      </CodeBlock>,
    );
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('falls back to "code" when no language className is present', () => {
    render(
      <CodeBlock>
        <code>plain text</code>
      </CodeBlock>,
    );
    expect(screen.getByText('code')).toBeInTheDocument();
  });

  it('renders highlighted code inside a <code> element', () => {
    const { container } = render(
      <CodeBlock>
        <code className="language-ts">const x = 1;</code>
      </CodeBlock>,
    );
    expect(container.querySelector('pre code')).not.toBeNull();
  });

  it('renders MermaidDiagram for language-mermaid blocks', () => {
    render(
      <CodeBlock>
        <code className="language-mermaid">graph TD; A--&gt;B;</code>
      </CodeBlock>,
    );
    expect(screen.getByTestId('mermaid')).toBeInTheDocument();
  });

  it('copies the raw code to the clipboard and toggles the button label', () => {
    render(
      <CodeBlock>
        <code className="language-ts">{`const greeting = "hi";`}</code>
      </CodeBlock>,
    );
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

  it('renders without crashing when children is not a valid element', () => {
    render(<CodeBlock>plain string</CodeBlock>);
    expect(screen.getByText('code')).toBeInTheDocument();
  });
});
