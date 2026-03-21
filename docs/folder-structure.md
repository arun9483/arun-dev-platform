# 📁 Folder Structure — Arun Dev Platform

This document defines the **exact folder structure, boundaries, and responsibilities** of each directory.

It is **strict and enforceable**.
All code must follow this structure.

---

# 🧠 1. Structure Philosophy

The project follows:

- **Feature-based modular architecture**
- **Clear separation of concerns**
- **Scalable monorepo design**

---

## 🎯 Goals

- High modularity
- Low coupling
- Easy scalability
- Clear ownership of code

---

# 🧱 2. Root Structure

```id="root-structure"
/
  apps/
  packages/
  docs/
  README.md
  AGENT.md
```

---

## Responsibilities

| Folder      | Purpose                               |
| ----------- | ------------------------------------- |
| `apps/`     | Application entry points              |
| `packages/` | Shared reusable modules               |
| `docs/`     | Architecture and system documentation |

---

# 🖥️ 3. Apps Layer

---

## Structure

```id="apps-structure"
apps/
  web/
```

---

## `apps/web` (Next.js Application)

```id="web-structure"
apps/web/
  app/
  components/
  features/
  lib/
  styles/
  tests/
```

---

## Responsibilities

---

### `app/`

- Next.js App Router
- Defines routes and layouts

---

### `components/`

- Shared UI components
- Presentational only (no business logic)

---

### `features/`

- Domain-based modules (core of the system)

---

### `lib/`

- Shared utilities (pure functions only)

---

### `styles/`

- Design tokens and global styles

---

### `tests/`

- Shared test infrastructure (setup files, fixtures, mocks)
- `e2e/` — E2E tests (Playwright, `*.e2e.spec.ts`)
- Unit and integration tests are co-located with source files, not here

---

# 📦 4. Feature-Based Architecture (Core Rule)

Each feature must be self-contained.

---

## Feature Structure

```id="feature-folder"
features/<feature-name>/
  components/
  hooks/
  services/
  repositories/
  types/
```

---

## Responsibilities

---

### `components/`

- Feature-specific UI
- No business logic

---

### `hooks/`

- Orchestrate data flow
- Call services
- Manage UI state

---

### `services/`

- Business logic
- Data transformation
- Filtering, sorting

---

### `repositories/`

- Data fetching and normalization
- No business logic

---

### `types/`

- TypeScript types and interfaces

---

---

# 🔌 5. Shared Code (`lib/`)

---

## Allowed

- Utility functions (pure)
- Constants
- Generic helpers

---

## ❗ Restrictions

- No business logic
- No feature-specific code

---

---

# 🎨 6. Styles Structure

---

```id="styles-structure"
styles/
  tokens/
  themes/
```

---

## Responsibilities

---

### `tokens/`

- Colors
- Spacing
- Typography

---

### `themes/`

- Theme configuration (light/dark, etc.)

---

---

# 🧪 7. Testing Structure

---

## Test File Convention

All test files follow the `<name>.<type>.spec.ts(x)` pattern:

| Type        | Pattern                    | Runner     | Location                    |
| ----------- | -------------------------- | ---------- | --------------------------- |
| Unit        | `*.unit.spec.ts(x)`        | Vitest     | Co-located with source file |
| Integration | `*.integration.spec.ts(x)` | Vitest     | Co-located with source file |
| E2E         | `*.e2e.spec.ts(x)`         | Playwright | `tests/e2e/` directory      |

---

## Directory Structure

```id="test-structure"
tests/
  setup.ts          # Shared test setup (jest-dom matchers)
  e2e/              # E2E tests only (Playwright)
```

Unit and integration tests are **co-located** with source files:

```
features/projects/
  services/
    project.service.ts
    project.service.unit.spec.ts
    project.service.integration.spec.ts
```

---

## Vitest Configuration

Each test type has a dedicated config for isolated, non-mixed results:

- `vitest.unit.config.ts` — unit tests only
- `vitest.integration.config.ts` — integration tests only

---

## Rules

- Unit and integration tests live next to the code they test
- E2E tests live in `tests/e2e/` (cross-feature user journeys)
- Shared test infrastructure (setup, fixtures, mocks) lives in `tests/`
- Prefer testing services and logic over UI
- Pre-commit hook runs unit tests only; integration and E2E run in CI

---

---

# 📦 8. Packages Layer

---

## Structure

```id="packages-structure"
packages/
  ui/
  config/
```

---

## Responsibilities

---

### `ui/`

- Reusable design system components
- No business logic

---

### `config/`

- Shared configurations:
  - ESLint
  - TypeScript
  - Tailwind

---

---

# 🔐 9. Import Rules (STRICT)

---

## Allowed Imports

| From    | Can Import                    |
| ------- | ----------------------------- |
| Feature | Its own modules               |
| Feature | Shared (`lib`, `packages`)    |
| Feature | Its own services/repositories |

---

## ❌ Forbidden Imports

- Feature A importing Feature B directly
- Components importing repositories
- Services importing UI components

---

---

# 🔄 10. Dependency Direction

```id="dependency-flow"
components → hooks → services → repositories
```

---

## ❗ Rules

- No reverse dependency
- No skipping layers

---

---

# 🚀 11. Scalability Guidelines

---

## Adding a New Feature

1. Create a new folder in `features/`
2. Follow the standard structure
3. Do not modify existing features

---

## Adding Shared Logic

- Place in:
  - `lib/` (if generic)
  - `packages/` (if reusable across apps)

---

---

# ⚠️ 12. Anti-Patterns (Strictly Forbidden)

- Large global folders with mixed responsibilities
- Cross-feature tight coupling
- Business logic inside components
- Dumping everything into `lib/`
- Deep nested folder chaos

---

---

# 🧱 13. Example Structure (Complete View)

```id="example-structure"
/apps
  /web
    /app
    /components
    /features
      /projects
      /articles
      /profile
    /lib
    /styles
    /tests

/packages
  /ui
  /config

/docs
```

---

---

# 📌 14. Definition of Structural Compliance

The codebase is compliant if:

- All features follow the defined structure
- No forbidden imports exist
- Business logic is isolated in services
- Shared code is properly placed

---

---

# 🧭 Final Note

This structure is designed for:

- long-term scalability
- clear ownership
- agent-friendly development

---

Any deviation must be:

- justified
- documented

---
