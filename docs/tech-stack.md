# ⚙️ Tech Stack — Arun Dev Platform

This document defines the **approved technologies, tools, and constraints** for the system.

It is **strict and enforceable**.
Any deviation must be justified.

---

# 🧠 1. Stack Philosophy

The tech stack is chosen based on:

- Performance (server-first, minimal JS)
- Developer experience (DX)
- Scalability and maintainability
- Compatibility with **agent-first development**

---

# 🧱 2. Core Stack

---

## 🖥️ Frontend Framework

- **Next.js 16.2.0**
  - App Router (mandatory)
  - React Server Components (default)
  - Server Actions (when needed)

---

## 🟦 Language

- **TypeScript (strict mode)**

---

## ❗ TypeScript Rules

- `"strict": true`
- No `any`
- Prefer explicit types over inference (for domain models)
- Use `type` over `interface` (unless extension is required)

---

# 🎨 3. Styling System

---

## Primary Choice

- **Tailwind CSS**

---

## With:

- Design tokens (colors, spacing, typography)
- Centralized theme configuration

---

## Rules

- No inline styles (except dynamic cases)
- No hardcoded values (use tokens)
- Shared UI must use consistent design tokens

---

## Optional (Advanced)

- Vanilla Extract (only if strongly justified)

---

# 📦 4. Monorepo & Tooling

---

## Monorepo Tool

- **Turborepo** (preferred)

---

## Structure

```id="stack-structure"
apps/
  web/

packages/
  ui/
  config/
```

---

## Package Responsibilities

- `ui` → reusable components
- `config` → shared configs (eslint, tsconfig, tailwind)

---

# 🧩 5. Content & Data Layer

---

## Primary Approach

- **MDX** → blog articles
- **Structured TypeScript/JSON** → projects, profile, achievements

---

## Rules

- All content must be **structured and typed**
- MDX must include metadata (frontmatter)
- No unstructured content blobs

---

## Optional CMS (Future)

- Sanity / Contentful (only if needed)

---

# 🔌 6. Data Access Layer

---

## Pattern

- Repository pattern (mandatory)

---

## Responsibilities

- Repositories:
  - fetch data
  - normalize data

- Services:
  - apply business logic

---

## ❗ Rules

- No direct data access in UI
- No business logic in repositories

---

# 🔍 7. Search

---

## Default

- **MiniSearch** or **FlexSearch** (local search)

---

## Optional

- Algolia (if scaling required)

---

# 🧪 8. Testing Stack

---

## Unit Testing

- **Vitest**

---

## Component Testing

- **React Testing Library**

---

## End-to-End Testing

- **Playwright**

---

## Rules

- Test business logic first
- Avoid excessive UI testing
- Avoid snapshot-heavy tests

---

# 🎯 9. Linting & Formatting

---

## Tools

- ESLint
- Prettier

---

## Rules

- No unused variables
- No console logs in production
- Consistent formatting enforced

---

# 🚀 10. Performance Strategy

---

## Defaults

- Server-first rendering (RSC)
- Static generation (SSG)
- Incremental Static Regeneration (ISR)

---

## Goals

- Minimal client-side JavaScript
- Fast initial load
- Lighthouse score ~100

---

# 🔐 11. Dependency Management Rules

---

## Allowed

- Well-maintained, widely adopted libraries

---

## Restrictions

- No unnecessary dependencies
- No duplicate libraries solving same problem
- Must justify:
  - bundle size impact
  - long-term maintenance
- All dependencies must use **exact pinned versions** (e.g., `"16.2.0"`, not `"^16.2.0"`)
- No range operators (`^`, `~`, `>=`, `*`) in `dependencies` or `devDependencies`
- Exceptions: `peerDependencies` may use `>=` for consumer flexibility, `workspace:*` for monorepo packages

---

# 🧠 12. Agent-First Considerations

---

## Requirements

- All data must be:
  - structured
  - typed
  - queryable

---

## Enables

- semantic search
- AI summarization
- conversational interfaces (future)

---

# 🧭 13. Environment Strategy

---

## Environments

- Development
- Production

---

## Rules

- Use environment variables for configs
- Do not hardcode secrets

---

# 📦 14. Build & Deployment (Planned)

---

## Platform (Recommended)

- Vercel

---

## Requirements

- Edge-ready where possible
- Fast builds
- Preview deployments

---

# ⚠️ 15. Forbidden Practices

- Using `any` in TypeScript
- Fetching data directly in UI
- Mixing business logic with components
- Adding libraries without justification
- Hardcoding values instead of tokens

---

# 🧱 16. Definition of Stack Compliance

The implementation is compliant if:

- All tools align with this document
- No unauthorized dependencies are introduced
- Type safety is enforced
- Performance principles are followed

---

# 📌 Final Note

This tech stack is intentionally **minimal but powerful**.

Prefer:

- built-in capabilities
- simplicity
- long-term maintainability

over:

- trendy tools
- unnecessary abstractions

---
