# Quality Baselines — 2026-06-12

> Phase 0 capture (record, don't gate) of the AI-first quality & security framework
> (`docs/plans/frontend-quality-security-ai-first.md`). Production build, local run.
> Trend = git history of this folder + monthly digests in `docs/quality/digests/`.

## Lighthouse (median of 3, production build, mobile emulation)

| Route                                         | Perf | A11y | LCP (ms) | TBT (ms) | CLS |
| --------------------------------------------- | ---- | ---- | -------- | -------- | --- |
| `/`                                           | 0.96 | 1.00 | 2855     | 0        | 0   |
| `/projects`                                   | 0.96 | 1.00 | 2705     | 0        | 0   |
| `/articles/react-server-components-deep-dive` | 0.96 | 0.96 | 2855     | 38       | 0   |
| `/search`                                     | 0.96 | 1.00 | 2854     | 0        | 0   |

Machine-readable ratchet source: `docs/quality/lighthouse-baseline.json`.
CI gate (warn mode until 2026-07-12, then blocking): never worse than baseline
(perf −2pts, metrics +10%, CLS +0.02). Absolute targets (perf ≥ 0.90, LCP ≤ 2.5s,
TBT ≤ 300ms, CLS ≤ 0.1, a11y ≥ 0.95) report as warnings and drive quarterly tightening.

## Bundle sizes — first-load JS per route (gzip)

| Route                                         | Size     | Budget |
| --------------------------------------------- | -------- | ------ |
| `/`                                           | 215.3 kB | 250 kB |
| `/projects`                                   | 209.0 kB | 250 kB |
| `/projects/arun-dev-platform`                 | 215.3 kB | 250 kB |
| `/articles`                                   | 209.0 kB | 250 kB |
| `/articles/react-server-components-deep-dive` | 220.0 kB | 250 kB |
| `/search`                                     | 220.8 kB | 250 kB |
| `/achievements`                               | 209.0 kB | 250 kB |

Source of truth: `apps/web/.size-limit.ts` (blocking in CI from day one).
Mermaid (~290 kB of chunks) is lazy-loaded and correctly absent from first-load.

## Dependency vulnerabilities (osv-scanner)

**After remediation: 0 known vulnerabilities** (`osv-scanner scan source --lockfile=pnpm-lock.yaml`).

Remediated in this rollout (pre-remediation scan found 24 advisories):

| Package         | Was          | Now          | Max CVSS fixed | Type                  |
| --------------- | ------------ | ------------ | -------------- | --------------------- |
| next            | 16.2.0       | 16.2.6       | 7.5 (high) ×3  | runtime framework     |
| turbo           | 2.8.20       | 2.9.14       | 9.8 (critical) | dev/build tooling     |
| vitest          | 3.2.4        | 3.2.6        | 9.8 (critical) | dev/test tooling      |
| vite            | 7.3.1        | 7.3.2        | 8.2 (high)     | transitive (override) |
| fast-uri        | 3.1.0        | 3.1.2        | 7.5 (high)     | transitive (override) |
| picomatch       | 2.3.1/4.0.3  | 2.3.2/4.0.4  | 7.5 (high)     | transitive (override) |
| postcss         | 8.4.31       | 8.5.10       | 6.1 (medium)   | transitive (override) |
| brace-expansion | 1.1.12/5.0.4 | 1.1.13/5.0.6 | 6.5 (medium)   | transitive (override) |
| yaml            | 2.8.2        | 2.8.3        | 4.3 (medium)   | transitive (override) |

Waiver policy: ignores go in `osv-scanner.toml` (none currently) with justification,
owner, and expiry ≤ 90 days. No permanent exceptions.

## Secrets (gitleaks)

Full-history scan (21 commits): **no leaks found**. Staged-secret gate verified:
a seeded AWS key + GitHub PAT are detected by `gitleaks protect --staged` (pre-commit).

## Accessibility (axe, wcag2a + wcag2aa, serious/critical)

| Route              | New violations | Notes |
| ------------------ | -------------- | ----- |
| `/`                | 0              |       |
| `/projects`        | 0              |       |
| `/projects/[slug]` | 0              |       |
| `/articles`        | 0              |       |
| `/articles/[slug]` | 0              |       |
| `/search`          | 0              |       |
| `/achievements`    | 0              |       |

Allowlist `apps/web/tests/e2e/a11y-known-issues.json` is **empty** — the gate is
zero new serious/critical violations with no grandfathered debt.
Gate verified: a seeded violation (img without alt, unlabeled input) fails `checkA11y`.

## Code health

| Metric                                   | Value                                                             |
| ---------------------------------------- | ----------------------------------------------------------------- |
| Unit coverage (lines/branch/func)        | 92.68% / 96.47% / 91.48% (163 tests)                              |
| Integration coverage (lines/branch/func) | 13.94% / 61.53% / 61.03% (6 tests)                                |
| knip findings                            | 0 (after triage: removed unused `tsx`, `eslint-config-next` deps) |
| jscpd duplication                        | 0.00% (61 files, ~15k lines)                                      |

Coverage thresholds are now **enforced** (`--coverage` in test scripts) as ratchets
just below measured values. Note: the previous unit thresholds of 100% were never
enforced (scripts didn't run coverage) and fail against reality — ratchet restores honesty.

## Bug found by the new gates

The `/search` page crashed client-side in production (`MiniSearch: duplicate ID
design-system-migration` — a project and an article share that slug). Fixed by
namespacing search document IDs by content type (`project:`/`article:`) in the
services. Caught by the first e2e journey run.
