# Frontend Quality & Security Framework — AI-First Execution Plan

> **How to use this document:** This is an execution-ready plan. Feed an entire phase (or the whole document) to Claude Code as a prompt, e.g. _"Execute Phase 1 of docs/plans/frontend-quality-security-ai-first.md"_. Each phase lists concrete tasks with acceptance criteria. Phases are ordered by risk-reduction-per-effort and must be executed in order (Phase 0 scaffolds everything else).

---

## 1. Context & Goals

**Scope:** All frontend TypeScript repositories — `arun-dev-platform` (this repo, Turborepo + pnpm + Next.js 16), `arun-design-system` (tokens + UI published as `@arun-dev/tokens`, `@arun-dev/ui`), and any future repos.

**Objectives:**

1. **Security** — detect and remediate vulnerabilities proactively
2. **Performance** — prevent regression, maintain optimal runtime characteristics
3. **Code quality** — enforce best practices, maintainability, modern patterns
4. **UX integrity** — catch visual, accessibility, and interactive regressions
5. **Scalability** — onboarding a new repo takes < 1 hour

**Hard constraints (decided):**

- **AI-first, zero new registrations, zero external dashboards.** No Snyk, no SonarQube/SonarCloud, no LHCI server, no Renovate app, no Chromatic. Only services already in use: GitHub, npm, Vercel.
- The intelligence layer is **Claude Code** (skills + MCP servers: Playwright MCP, Context7) running over **free, no-account CLI tools**.
- Skills are **markdown rubrics the AI executes** with its own tools (Bash/Grep/Read/Playwright MCP) — not wrappers around hand-written scripts.
- **CI stays purely deterministic** (no API keys, no AI in GitHub Actions). AI runs locally and on demand.
- AI pre-push checks are an **explicit `/preflight` skill** run in the developer's Claude Code session; the git pre-push hook stays deterministic and only prints a reminder when preflight is stale.
- Reports and baselines live **in the repo** (committed JSON/markdown); findings become **GitHub issues** via `gh`. History = git history. No dashboards.

**Current state (verified):**

- ✅ CI on PR: lint (ESLint 9 flat, typescript-eslint strict), prettier check, typecheck, Vitest unit (100% coverage thresholds) + integration, build, Playwright e2e (Chromium only) — `.github/workflows/ci.yml`
- ✅ Husky: pre-commit (lint-staged + unit tests), pre-push (lint + typecheck + tests), commit-msg (commitlint conventional)
- ✅ Turbo remote caching; shared configs in `packages/config`
- ❌ No security tooling (no dependency scanning, SAST, secret scanning)
- ❌ No performance gates (no Lighthouse, no bundle budgets, no RUM)
- ❌ No a11y testing (no axe, no eslint-plugin-jsx-a11y)
- ❌ No visual regression; e2e is Chromium-only; no integration coverage thresholds

---

## 2. Architecture: Two Layers

```
┌─────────────────────────────────────────────────────────────┐
│  INTELLIGENCE LAYER (Claude Code — local, interactive)       │
│  Skills: /preflight /ux-audit /security-audit /perf-audit    │
│          /quality-audit /deps-modernize /quality-digest      │
│  MCP: Playwright MCP (browser), Context7 (live docs)         │
│  Role: triage, judgment, semantic review, fixes, digests     │
│  Mode: ADVISORY — interactive findings, fix-as-you-go        │
├─────────────────────────────────────────────────────────────┤
│  DETERMINISTIC LAYER (free CLIs — hooks + GitHub Actions)    │
│  eslint · tsc · vitest · playwright · osv-scanner ·          │
│  gitleaks · lighthouse CLI · size-limit · @axe-core/         │
│  playwright · knip · jscpd                                   │
│  Role: blocking gates, the safety net that always runs       │
│  Mode: BLOCKING — works even if nobody runs the AI           │
└─────────────────────────────────────────────────────────────┘
```

The deterministic layer guarantees a floor; the intelligence layer raises the ceiling (finds what pattern-matching can't, explains, and fixes).

---

## 3. Tool Matrix

| Pillar                     | Tool(s)                                                                                                                | Why / Notes                                                                                                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency vulnerabilities | **osv-scanner** (Google, free binary, no account; scans `pnpm-lock.yaml`)                                              | CI gate at high+ severity. `/security-audit` skill triages findings for actual exploitability (compensates for osv's lack of reachability analysis) and proposes pinned-version fixes.                     |
| SAST / semantic security   | **Claude Code `/security-review`** (built-in) + **eslint-plugin-security**                                             | AI semantic review of diffs catches app-level logic flaws pattern-matchers miss. ESLint plugin is the deterministic floor.                                                                                 |
| Secrets                    | **gitleaks** (free binary)                                                                                             | `gitleaks protect --staged` at pre-commit; full scan in CI. GitHub's free public-repo secret scanning runs automatically anyway.                                                                           |
| Code quality metrics       | **knip** (dead code/exports/deps) + **jscpd** (duplication) + ESLint strict (existing) + **`/code-review`** (built-in) | Metrics snapshot committed as JSON; AI reports deltas. knip supersedes ts-prune + depcheck.                                                                                                                |
| Performance (lab)          | **lighthouse CLI** (no signup) + **size-limit**                                                                        | Lighthouse 3-run median against built app on 3–5 key routes, asserted against committed baseline. size-limit gives blocking per-route bundle budgets on PRs.                                               |
| Performance (field/RUM)    | _Optional:_ Vercel Speed Insights (already on Vercel, but it is a dashboard)                                           | Not core. Revisit if lab data proves insufficient.                                                                                                                                                         |
| Dependency currency        | **`/deps-modernize`** skill: `pnpm outdated` + osv-scanner + **Context7 MCP**                                          | Context7 supplies current docs/breaking-changes; AI proposes grouped upgrade PRs via `gh`. Replaces Renovate. Note: Context7 is a docs-lookup MCP for AI agents, not a scanner — this is its correct role. |
| Visual regression          | **Playwright `toHaveScreenshot()`** baselines committed in-repo                                                        | Plus `/ux-audit` skill driving Playwright MCP for judgment-based UX review.                                                                                                                                |
| Accessibility              | **@axe-core/playwright** + **eslint-plugin-jsx-a11y**                                                                  | Runtime + static. Gate on zero NEW serious/critical violations.                                                                                                                                            |
| Reporting                  | Committed baselines in `docs/quality/` + GitHub issues via `gh` + monthly AI digest                                    | No dashboards.                                                                                                                                                                                             |

**Explicitly rejected:** Snyk, SonarQube/SonarCloud, CodeQL (redundant with AI review + eslint-security), LHCI server, Renovate app, Chromatic/Percy — all require registration and/or dashboards.

---

## 4. Execution Tiers

| Tier                                             | Checks                                                                                                                                                                                                                                                                                                                           | Blocking?               |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **Pre-commit** (husky)                           | lint-staged (ESLint incl. jsx-a11y + security plugins, Prettier) + `gitleaks protect --staged`. **Remove unit tests from pre-commit** (duplicated at pre-push; keeps commits < 5 s).                                                                                                                                             | Yes                     |
| **Dev session (AI)**                             | **`/preflight`** before push: UX audit of changed routes (Playwright MCP) + `/security-review` of diff + perf spot-check. Writes a preflight stamp.                                                                                                                                                                              | Advisory, interactive   |
| **Pre-push** (husky)                             | lint, typecheck, affected tests (`turbo run test --filter=...[origin/main]`) + non-blocking **reminder** if preflight stamp is older than HEAD.                                                                                                                                                                                  | Deterministic part: yes |
| **PR gate** (GitHub Actions, reusable workflows) | `quality.yml`: lint/typecheck/unit+integration (add integration thresholds)/build · `security.yml`: osv-scanner (fail high+), gitleaks full scan · `performance.yml`: size-limit (blocking), lighthouse budgets (warn for first 30 days → block) · `ux-regression.yml`: e2e Chromium + axe (zero new serious) + visual snapshots | Yes                     |
| **Merge-to-main**                                | Cross-browser Playwright matrix (Chromium + Firefox + WebKit); failure auto-opens issue.                                                                                                                                                                                                                                         | Issue-filing            |
| **Nightly** (CI cron)                            | osv-scanner full rescan (catches CVEs disclosed for unchanged deps) → `gh issue` labeled `sev:*`; full e2e suite.                                                                                                                                                                                                                | Issue-filing            |
| **Weekly** (AI, on-demand or scheduled)          | `/quality-audit` (knip + jscpd + coverage deltas + AI review), `/deps-modernize`.                                                                                                                                                                                                                                                | Advisory                |
| **Monthly** (AI)                                 | `/quality-digest`: reads baselines + issue history, writes KPI-delta digest to `docs/quality/digests/`.                                                                                                                                                                                                                          | Advisory                |

---

## 5. Org-Wide Architecture: `frontend-platform-kit` repo

One new **git repo** (no registrations) consumed by all frontend repos:

```
frontend-platform-kit/
  .claude-plugin/             # Claude Code plugin manifest (installable from git)
  skills/
    preflight/SKILL.md        # orchestrates ux + security + perf pre-push audit
    ux-audit/SKILL.md         # Playwright MCP rubric: routes, viewports, axe, heuristics
    security-audit/SKILL.md   # osv-scanner + gitleaks + semantic diff review rubric
    perf-audit/SKILL.md       # lighthouse CLI vs baseline, size-limit, explain deltas
    quality-audit/SKILL.md    # knip, jscpd, coverage deltas, code-review
    deps-modernize/SKILL.md   # pnpm outdated + osv + Context7 → upgrade PRs
    quality-digest/SKILL.md   # monthly KPI digest from baselines + issues
  .github/workflows/          # reusable deterministic workflows (workflow_call)
    quality.yml
    security.yml
    performance.yml
    ux-regression.yml
    nightly-audit.yml
  actions/setup-node-pnpm/action.yml   # composite: checkout, pnpm, node, turbo cache
  docs/baselines-template.md
```

**Rules:**

- Skills are **markdown rubrics** (routes to audit, severity definitions, report format, conventions like `screenshots/` + delete-after-review). The AI executes them with its own tools; no hand-written TS/JS wrappers.
- Consumer repos call reusable workflows with a ~25-line `ci.yml` via `uses: <org>/frontend-platform-kit/.github/workflows/quality.yml@v1`. **Pin to tags (`@v1`), never `@main`** — a bad main would break every repo simultaneously.
- Publish `packages/config` as **`@arun-dev/eslint-config`** and **`@arun-dev/ts-config`** to npm (publish pipeline already exists for `@arun-dev/tokens`/`ui`) so `arun-design-system` and future repos inherit the same lint policy. The jsx-a11y and security ESLint plugins are added once, there.
- GitHub org **rulesets** require the named workflow checks on default branches.
- Exact pinned versions for all new devDependencies (repo convention).

---

## 6. Integration Specifics

- **Preflight stamp:** `/preflight` writes `.git/preflight-stamp` on completion. The pre-push hook compares its mtime against HEAD's commit time; if stale, print a one-line reminder (never block): `ℹ Preflight not run since last commit — consider running /preflight in Claude Code.`
- **Playwright visual:** run in the pinned `mcr.microsoft.com/playwright:<exact-version>` container in CI (Linux font consistency). `maxDiffPixelRatio: 0.01`, `animations: 'disabled'`, mask dynamic regions. **Baselines are generated by CI** (label-triggered `update-snapshots` job that commits to the PR branch) — never on macOS. Start with ~10 high-value pages/states + `@arun-dev/ui` component states.
- **axe:** shared `checkA11y(page)` fixture wrapping `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()`, called at the end of each e2e journey. Gate: zero **new** serious/critical. Existing violations live in committed `a11y-known-issues.json` entries with owner + expiry ≤ 90 days, burned down over time.
- **lighthouse CLI:** `pnpm build && pnpm start`, then lighthouse against 3–5 key routes, 3 runs, take median. Budgets: script ≤ 300 KB, LCP ≤ 2.5 s (lab), TBT ≤ 300 ms, CLS ≤ 0.1, a11y score ≥ 0.95. Baseline JSON committed at `docs/quality/lighthouse-baseline.json`; gates ratchet from baseline ("no worse than"), tightened quarterly — never absolute targets on day one.
- **osv-scanner:** `osv-scanner --lockfile=pnpm-lock.yaml`, fail at high+. Ignores go in `osv-scanner.toml` and require justification, owner, expiry ≤ 90 days. No permanent exceptions.
- **size-limit:** `@size-limit/preset-app` for `apps/web` per-route budgets; `preset-small-lib` for published packages in arun-design-system.

---

## 7. Rollout Roadmap (execute phases in order)

### Phase 0 — Scaffolding & baselines (~2–3 dev-days)

1. Create `frontend-platform-kit` repo: plugin manifest, skills skeleton (empty rubric stubs), composite setup action.
2. Extract this repo's `ci.yml` steps into reusable `quality.yml`; consume it from both repos via `@v1` tag.
3. Capture baselines — **record, don't gate**: one-off lighthouse run (key routes), bundle sizes, `osv-scanner` scan, full-site axe scan. Commit results to `docs/quality/baselines-<date>.md` + JSON files.
4. **Acceptance:** both repos green on `@v1` quality workflow; baseline files committed.

### Phase 1 — Security (~3 dev-days)

1. Add `security.yml` reusable workflow: osv-scanner (fail high+), gitleaks full scan. Wire into both repos' PR gates.
2. Add `gitleaks protect --staged` to pre-commit; **remove `pnpm run test:unit` from pre-commit** (stays in pre-push).
3. Publish `@arun-dev/eslint-config` with `eslint-plugin-security` + `eslint-plugin-jsx-a11y`; adopt in both repos.
4. Write `skills/security-audit/SKILL.md` rubric: run osv-scanner + gitleaks, triage each finding against actual code usage, severity policy, fix proposals, `gh issue` filing format.
5. Add nightly cron workflow: osv rescan → auto-issue labeled `sev:<level>`.
6. **Acceptance:** a PR introducing a known-vulnerable dep version is blocked; a staged secret is rejected at commit; `/security-audit` produces a triaged report.

### Phase 2 — Performance (~3 dev-days)

1. Add size-limit configs (blocking) to `apps/web` and design-system packages; wire `performance.yml`.
2. Add lighthouse CLI job: budgets in warn mode for 30 days, then flip to blocking; baseline ratchet.
3. Write `skills/perf-audit/SKILL.md`: run lighthouse locally vs committed baseline, explain regressions (which commit/bundle caused it), propose fixes.
4. **Acceptance:** a PR that doubles a route's JS is blocked by size-limit; `/perf-audit` correctly identifies a seeded regression.

### Phase 3 — UX integrity (~5 dev-days)

1. Add `@axe-core/playwright` fixture + `a11y-known-issues.json` allowlist; integrate into existing e2e journeys.
2. Add visual snapshots for ~10 high-value pages/states; CI container pinning; label-triggered baseline-update job.
3. Add cross-browser (Firefox + WebKit) project to Playwright config, running on merge-to-main only.
4. Add integration-test coverage thresholds to `vitest.integration.config.ts`.
5. Write `skills/ux-audit/SKILL.md` rubric: routes + viewports to inspect via Playwright MCP, axe checks, heuristic checklist (layout, contrast, interaction states), screenshots to `screenshots/` (deleted after review), report format.
6. Write `skills/preflight/SKILL.md`: orchestrate ux-audit (changed routes only) + `/security-review` of diff + perf spot-check; write `.git/preflight-stamp`.
7. Add the stale-preflight reminder to `.husky/pre-push`.
8. **Acceptance:** an intentional visual change fails snapshot diff; a seeded a11y violation (missing alt) fails the gate; `/preflight` runs end-to-end and the pre-push reminder appears/disappears correctly.

### Phase 4 — Modernization & governance (~3 dev-days)

1. Write `skills/deps-modernize/SKILL.md`: `pnpm outdated` + osv + Context7 docs lookup → grouped upgrade plan → PRs via `gh` (exact pinned versions, per repo convention).
2. Add knip + jscpd to weekly cron (advisory, auto-issue) and to `/quality-audit` rubric.
3. Write `skills/quality-digest/SKILL.md`: monthly KPI-delta digest from baselines + issue history → `docs/quality/digests/<YYYY-MM>.md`.
4. Configure GitHub org rulesets requiring the named checks; document the waiver process (justification + owner + expiry ≤ 90 days for osv ignores and a11y allowlist).
5. **Acceptance:** new-repo onboarding documented and takes < 1 hour (25-line ci.yml + plugin install + ruleset).

---

## 8. Metrics & Governance (dashboard-free)

**KPIs per pillar:**

| Pillar      | KPI                                 | Target                                       |
| ----------- | ----------------------------------- | -------------------------------------------- |
| Security    | Critical/high vulns open            | 0 critical; MTTR critical < 24 h, high < 7 d |
| Security    | Secrets blocked at pre-commit/CI    | 100% (zero in history)                       |
| Performance | Lighthouse perf score (lab, median) | ≥ 90, never below baseline                   |
| Performance | Bundle vs size-limit budget         | Green; budget tightened quarterly            |
| Quality     | New-code coverage / duplication     | ≥ 90% / < 3% (jscpd)                         |
| Quality     | knip findings                       | Trend ↓                                      |
| UX          | New serious/critical axe violations | 0; allowlist burn-down ↓ monthly             |
| Velocity    | PR CI p50 / flake rate              | < 10 min / < 2%                              |

**Storage:** baselines + monthly digests committed under `docs/quality/`; findings as labeled GitHub issues (`sev:critical` … `sev:low`). Trend = git history + digest deltas.

**Escalation:** critical = CI blocks + auto-issue + 24 h SLA · high = blocks + 7 d · medium/low = monthly triage in digest.

**Waivers:** every exception (osv-scanner.toml entry, a11y allowlist entry) requires justification, owner, and expiry ≤ 90 days, reviewed in PR. No permanent exceptions.

---

## 9. Risks & Mitigations

1. **Preflight discipline** — it's advisory; developers may skip it. Mitigation: pre-push reminder + deterministic CI catches everything gate-worthy regardless.
2. **AI audit consistency** — runs must be comparable. Mitigation: skills contain explicit rubrics (exact routes, viewports, severity definitions, report format).
3. **Visual snapshot flakiness** — biggest adoption killer. Mitigation: pinned Playwright container, masking, animations disabled, 1% diff ratio, CI-generated baselines, small initial surface.
4. **osv-scanner has no reachability analysis** (vs Snyk). Mitigation: AI triage in `/security-audit` assesses real exploitability; gate stays conservative at high+.
5. **Lighthouse variance on shared runners.** Mitigation: median-of-3, ratchet-from-baseline assertions, 30-day warn mode before blocking.
6. **Shared-workflow versioning** — consuming `@main` would make platform-kit a single point of failure. Mitigation: tag-pinning enforced via review checklist.
