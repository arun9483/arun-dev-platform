# docs/quality — baselines, budgets, and governance

This folder is the dashboard-free home of the quality & security framework
(plan: `docs/plans/frontend-quality-security-ai-first.md`; shared workflows and
skills: [frontend-platform-kit](https://github.com/arun9483/frontend-platform-kit)).

## Contents

| File                       | Purpose                                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `baselines-<date>.md`      | Point-in-time capture of all KPIs (lighthouse, bundles, vulns, axe, code health). New file per audit; trend = git history. |
| `lighthouse-baseline.json` | Machine-readable ratchet source for the CI lighthouse gate ("never worse than baseline").                                  |
| `digests/<YYYY-MM>.md`     | Monthly KPI-delta digest written by `/quality-digest`.                                                                     |

Related gates living elsewhere: `apps/web/.size-limit.ts` (bundle budgets),
`apps/web/tests/e2e/a11y-known-issues.json` (axe allowlist), `osv-scanner.toml`
(vuln waivers — file absent while empty), coverage thresholds in
`apps/web/vitest.*.config.ts`.

## The two layers

- **Deterministic (blocking):** PR gate via reusable workflows pinned `@v1` —
  quality / security (osv high+, gitleaks) / performance (size-limit blocking;
  lighthouse warn until 2026-07-12, then blocking) / ux-regression (e2e + axe +
  visual snapshots). Merge-to-main: Firefox+WebKit. Nightly: osv rescan + full e2e
  → auto-issues labeled `sev:*`. Weekly: knip + jscpd → `code-health` issue.
- **AI (advisory):** `/preflight` before push, `/security-audit`, `/perf-audit`,
  `/ux-audit`, `/quality-audit`, `/deps-modernize`, `/quality-digest` — installed
  from the frontend-platform-kit Claude Code plugin.

## Ratchet & waiver rules

1. Gates assert "no worse than committed baseline", not absolute targets.
   Absolute targets (perf ≥ 0.90, LCP ≤ 2.5 s, TBT ≤ 300 ms, CLS ≤ 0.1, a11y ≥ 0.95,
   route JS ≤ 250 kB, duplication < 3%) surface as warnings and set the quarterly
   tightening direction.
2. Baselines and budgets are tightened quarterly in a reviewed PR — never loosened
   silently. A justified loosening must explain what changed and why it's accepted.
3. Every waiver (`osv-scanner.toml` entry, `a11y-known-issues.json` entry) requires
   **justification + owner + expiry ≤ 90 days**, reviewed in PR. Expired entries stop
   being honored automatically. No permanent exceptions.
4. Severity SLAs: `sev:critical` — fix < 24 h; `sev:high` — < 7 d; medium/low —
   monthly triage in the digest.

## Updating baselines

- **Lighthouse:** delete `lighthouse-baseline.json` and run the performance workflow
  (or the lighthouse-audit action locally) — record mode rewrites it; commit with the
  justification in the PR.
- **Visual snapshots:** add the `update-snapshots` label to the PR; CI regenerates
  baselines in the pinned Linux container and commits them. Never generate on macOS.
- **Bundle budgets / coverage thresholds:** edit the config next to the measured
  numbers, with the new measurement quoted in the PR description.
