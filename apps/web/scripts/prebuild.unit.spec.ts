import { describe, it, expect, vi } from 'vitest';
import { join } from 'node:path';
import {
  resolveBrandCssPath,
  buildBrandCss,
  runMain,
  TOKENS_DIR,
  OUTPUT_PATH,
  type FsOps,
} from './prebuild';

const BASE_CONTENT = '/* base css */';
const BRAND_CONTENT = '/* brand css */';

const makeFsMock = (overrides: Partial<FsOps> = {}): FsOps => ({
  existsSync: vi.fn().mockReturnValue(true),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn().mockReturnValue(BASE_CONTENT),
  writeFileSync: vi.fn(),
  ...overrides,
});

describe('resolveBrandCssPath', () => {
  it('builds the correct path for a given brand', () => {
    const result = resolveBrandCssPath('arun', '/tokens');
    expect(result).toBe(join('/tokens', 'src', 'brands', 'arun.css'));
  });

  it('builds the correct path for the default brand', () => {
    const result = resolveBrandCssPath('default', '/tokens');
    expect(result).toBe(join('/tokens', 'src', 'brands', 'default.css'));
  });
});

describe('buildBrandCss', () => {
  it('concatenates base and brand CSS and writes to the output path', () => {
    const fs = makeFsMock({
      readFileSync: vi.fn().mockReturnValueOnce(BASE_CONTENT).mockReturnValueOnce(BRAND_CONTENT),
    });

    buildBrandCss('arun', '/tokens', '/out/brand.css', fs);

    expect(fs.readFileSync).toHaveBeenCalledWith(join('/tokens', 'src', 'base.css'), 'utf-8');
    expect(fs.readFileSync).toHaveBeenCalledWith(
      join('/tokens', 'src', 'brands', 'arun.css'),
      'utf-8',
    );
    expect(fs.mkdirSync).toHaveBeenCalledWith('/out', { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/out/brand.css',
      `${BASE_CONTENT}\n${BRAND_CONTENT}`,
    );
  });

  it('throws a descriptive error when base.css is not found', () => {
    const fs = makeFsMock({ existsSync: vi.fn().mockReturnValue(false) });

    expect(() => buildBrandCss('arun', '/tokens', '/out/brand.css', fs)).toThrow(
      /Base CSS not found/,
    );
  });

  it('includes the missing base.css path in the error message', () => {
    const fs = makeFsMock({ existsSync: vi.fn().mockReturnValue(false) });
    const expectedPath = join('/tokens', 'src', 'base.css');

    expect(() => buildBrandCss('arun', '/tokens', '/out/brand.css', fs)).toThrow(expectedPath);
  });

  it('throws a descriptive error when the brand CSS file is not found', () => {
    const fs = makeFsMock({
      existsSync: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
    });

    expect(() => buildBrandCss('missing-brand', '/tokens', '/out/brand.css', fs)).toThrow(
      /Brand CSS not found/,
    );
  });

  it('includes the missing brand file path in the error message', () => {
    const fs = makeFsMock({
      existsSync: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
    });
    const expectedPath = join('/tokens', 'src', 'brands', 'missing.css');

    expect(() => buildBrandCss('missing', '/tokens', '/out/brand.css', fs)).toThrow(expectedPath);
  });
});

describe('runMain', () => {
  it('calls buildBrandCss and writes the output', () => {
    const fs = makeFsMock({
      readFileSync: vi.fn().mockReturnValueOnce(BASE_CONTENT).mockReturnValueOnce(BRAND_CONTENT),
    });
    runMain('arun', '/tokens', '/out/brand.css', fs);

    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('defaults to the arun brand when NEXT_PUBLIC_BRAND is not set', () => {
    delete process.env['NEXT_PUBLIC_BRAND'];
    const fs = makeFsMock({
      readFileSync: vi.fn().mockReturnValueOnce(BASE_CONTENT).mockReturnValueOnce(BRAND_CONTENT),
    });
    runMain(undefined, '/tokens', '/out/brand.css', fs);

    expect(fs.readFileSync).toHaveBeenCalledWith(
      join('/tokens', 'src', 'brands', 'arun.css'),
      'utf-8',
    );
  });

  it('uses NEXT_PUBLIC_BRAND env var as the default brand', () => {
    process.env['NEXT_PUBLIC_BRAND'] = 'default';
    const fs = makeFsMock({
      readFileSync: vi.fn().mockReturnValueOnce(BASE_CONTENT).mockReturnValueOnce(BRAND_CONTENT),
    });
    runMain(undefined, '/tokens', '/out/brand.css', fs);

    expect(fs.readFileSync).toHaveBeenCalledWith(
      join('/tokens', 'src', 'brands', 'default.css'),
      'utf-8',
    );
    delete process.env['NEXT_PUBLIC_BRAND'];
  });

  it('uses the module-level TOKENS_DIR constant as default', () => {
    expect(typeof TOKENS_DIR).toBe('string');
    expect(TOKENS_DIR).toContain('packages');
    expect(TOKENS_DIR).toContain('tokens');
  });

  it('uses the module-level OUTPUT_PATH constant as default', () => {
    expect(typeof OUTPUT_PATH).toBe('string');
    expect(OUTPUT_PATH).toContain('brand.css');
  });
});
