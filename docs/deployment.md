# Deployment Strategy — Arun Dev Platform

This document defines the deployment architecture, environments, CI/CD pipeline, and operational procedures.

---

## 1. Platform

- **Vercel** — hosting and deployment (native GitHub integration)
- **GitHub Actions** — CI pipeline for PRs
- **Husky** — local pre-push hook as safeguard for direct pushes

Vercel's native GitHub integration handles all deployments automatically. Quality gates are enforced locally via pre-push hook and in CI via GitHub Actions on PRs.

---

## 2. Environments

| Environment | Vercel Scope | Domain                        | Trigger        |
| ----------- | ------------ | ----------------------------- | -------------- |
| Production  | `production` | `arunkumartripathi.dev`       | Push to `main` |
| Preview     | `preview`    | Auto-generated `*.vercel.app` | Every PR       |

---

## 3. Deployment Flow

### Direct push to main (solo workflow)

```
code → commit (pre-commit: lint-staged + unit tests)
     → push (pre-push: lint + typecheck + tests)
     → Vercel auto-deploys to production
```

### PR-based workflow

```
feature/* → PR → CI runs (lint, format, typecheck, tests, build, e2e)
           → Vercel creates preview deployment
           → merge to main → Vercel auto-deploys to production
```

---

## 4. Quality Gates

### 4.1 Pre-commit Hook (`.husky/pre-commit`)

Runs on every commit:

- lint-staged (ESLint + Prettier on staged files)
- Unit tests (`pnpm test:unit`)

### 4.2 Pre-push Hook (`.husky/pre-push`)

Runs on every push — blocks push if any check fails:

1. Lint (`pnpm lint`)
2. Typecheck (`pnpm typecheck`)
3. Tests (`pnpm test` — unit + integration)

### 4.3 CI Workflow (`.github/workflows/ci.yml`)

**Trigger:** Automatic on all PRs to `main` and `develop`

Pipeline stages:

1. Lint (`pnpm lint`)
2. Format check (`pnpm format:check`)
3. Typecheck (`pnpm typecheck`)
4. Tests (`pnpm test` — unit + integration)
5. Build (`pnpm build`)
6. E2E tests (`pnpm test:e2e` — skips gracefully if no tests exist)

### 4.4 Caching (CI)

- **pnpm store** — cached via `actions/setup-node` with `cache: 'pnpm'`
- **Turborepo remote cache** — enabled via `TURBO_TOKEN` and `TURBO_TEAM` secrets (free with Vercel)

---

## 5. Environment Variables

### 5.1 GitHub Repository Secrets

| Secret        | Purpose                               |
| ------------- | ------------------------------------- |
| `TURBO_TOKEN` | Turborepo remote cache authentication |
| `TURBO_TEAM`  | Turborepo team slug                   |

### 5.2 Application Environment Variables

| Scope             | Where Configured                                      |
| ----------------- | ----------------------------------------------------- |
| Production        | Vercel Dashboard → Environment Variables → Production |
| Preview           | Vercel Dashboard → Environment Variables → Preview    |
| Local Development | `apps/web/.env.local` (copy from `.env.example`)      |

### 5.3 Rules

- Never commit secrets to the repository
- Use `.env.example` as the template (committed, no real values)
- `.env.local` and all `.env.*` files are gitignored
- AI agents must never read or reference `.env.*` files (except `.env.example`)

---

## 6. Vercel Configuration

### `vercel.json` (repo root)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build"
}
```

- Every push triggers a Vercel build — no commits are skipped
- `installCommand` uses `--frozen-lockfile` for reproducible installs

---

## 7. One-Time Setup

1. Run `vercel link` in the repo root to connect the project
2. Ensure Vercel's GitHub integration is enabled (auto-deploy on push to `main`)
3. Add `TURBO_TOKEN` and `TURBO_TEAM` to GitHub repo secrets (Settings → Secrets and variables → Actions)
4. Configure custom domain `arunkumartripathi.dev` in Vercel Dashboard when ready

---

## 8. How to Deploy

### Production

Push to `main` — Vercel deploys automatically.

### Preview

Open a PR — Vercel creates a preview deployment with a unique URL.

---
