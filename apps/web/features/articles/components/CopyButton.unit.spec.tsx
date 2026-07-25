import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CopyButton } from './CopyButton';

const writeText = vi.fn();
Object.assign(navigator, { clipboard: { writeText } });

describe('CopyButton', () => {
  beforeEach(() => {
    writeText.mockClear();
    vi.useFakeTimers();
  });

  it('copies the raw code to the clipboard and toggles the label', () => {
    render(<CopyButton rawCode="const x = 1;" />);
    const button = screen.getByRole('button', { name: /copy code to clipboard/i });
    expect(button).toHaveTextContent('Copy');
    expect(button).toHaveAttribute('data-copied', 'false');

    fireEvent.click(button);
    expect(writeText).toHaveBeenCalledWith('const x = 1;');
    expect(button).toHaveTextContent('✓ Copied');
    expect(button).toHaveAttribute('data-copied', 'true');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(button).toHaveTextContent('Copy');
    expect(button).toHaveAttribute('data-copied', 'false');
  });
});
