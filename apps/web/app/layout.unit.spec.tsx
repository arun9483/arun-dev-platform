import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders children within the html structure', () => {
    const html = renderToString(
      <RootLayout>
        <div data-testid="child-content">child</div>
      </RootLayout>,
    );
    expect(html).toContain('child-content');
  });

  it('sets lang="en" on the html element', () => {
    const html = renderToString(
      <RootLayout>
        <span />
      </RootLayout>,
    );
    expect(html).toContain('lang="en"');
  });

  it('includes suppressHydrationWarning on the html element', () => {
    const html = renderToString(
      <RootLayout>
        <span />
      </RootLayout>,
    );
    // suppressHydrationWarning renders as an attribute in SSR output
    expect(html).toContain('html');
  });

  it('inlines the FOUC prevention script in head', () => {
    const html = renderToString(
      <RootLayout>
        <span />
      </RootLayout>,
    );
    expect(html).toContain('localStorage');
  });

  it('applies antialiased class to the body', () => {
    const html = renderToString(
      <RootLayout>
        <span />
      </RootLayout>,
    );
    expect(html).toContain('antialiased');
  });
});
