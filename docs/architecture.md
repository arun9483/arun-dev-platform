# 🏗️ Architecture — Arun Dev Platform

This document defines the **concrete architecture, boundaries, and implementation rules** for the system.

It is intended to be **actionable by both humans and AI agents**.

---

# 🧠 1. Architecture Style

The system follows a combination of:

- **Clean Architecture (strict layering)**
- **Feature-based modular design**
- **Repository pattern for data access**
- **Agent-first structured data modeling**

---

# 🧱 2. Layered System Design

The system is divided into enforceable layers:

```
UI (Next.js Components / Pages)
  ↓
Hooks (Application Layer)
  ↓
Services (Domain Logic)
  ↓
Repositories (Data Access Abstraction)
  ↓
Data Sources (MDX / JSON / CMS / API)
```

---

## 🔒 2.1 Dependency Rules (STRICT)

| From Layer   | Can Depend On     |
| ------------ | ----------------- |
| UI           | Hooks only        |
| Hooks        | Services only     |
| Services     | Repositories only |
| Repositories | Data Sources only |

---

## ❗ Violations (Not Allowed)

- UI importing repositories or services directly
- Services importing UI code
- Repositories containing business logic
- Cross-feature direct imports

---

# 🔌 3. Data Flow Contract

All features must follow this flow:

```
Component → Hook → Service → Repository → Data Source
```

---

## Responsibilities

### UI (Component / Page)

- Rendering only
- No business logic
- No data fetching

---

### Hooks

- Orchestrate calls to services
- Manage loading / error states
- No domain logic

---

### Services

- Core business logic
- Data transformation
- Filtering, sorting, aggregation

---

### Repositories

- Fetch raw data
- Normalize data format
- No business decisions

---

### Data Source

- Static (MDX, JSON) or external (CMS/API)

---

# 📦 4. Feature-Based Modular Architecture

Each domain must be isolated.

---

## Feature Structure

```
features/<feature-name>/
  components/
  hooks/
  services/
  repositories/
  types/
```

---

## Rules

- No shared mutable state across features
- Features communicate only via services or shared abstractions
- No direct imports between unrelated features

---

# 🧩 5. Core Domains (Implementation Boundaries)

---

## profile

- Static structured data
- No complex business logic

---

## projects

- Case-study driven
- Must support:
  - filtering
  - sorting
  - tagging

---

## articles

- MDX-based content
- Metadata-driven (tags, difficulty, topics)

---

## achievements

- Structured records
- Minimal transformations

---

## agent

- Query layer over all domains
- Aggregates cross-domain data
- Must not depend on UI

---

# 🤖 6. Agent-First Data Architecture

All entities must be **strictly structured**.

---

## Example: Project Entity Contract

```
Project {
  id: string
  title: string
  description: string
  problem: string
  solution: string
  techStack: string[]
  impact: {
    metric: string
    value: string
  }[]
  tags: string[]
}
```

---

## Rules

- No unstructured blobs when structured fields are possible
- All entities must include metadata
- Relationships must be derivable (via tags or references)

---

# 🔄 7. Rendering Architecture (Next.js 16.2.0)

---

## Default Strategy

- Use **React Server Components (RSC)** wherever possible
- Keep client components minimal

---

## Rendering Decisions

| Content Type | Strategy               |
| ------------ | ---------------------- |
| Projects     | SSG                    |
| Articles     | SSG                    |
| Profile      | SSG                    |
| Agent UI     | Client + Server hybrid |

---

## 7.1 RSC Orchestration — Loader Pattern

### The Problem

RSC pages cannot use React hooks (`useState`, `useEffect`). The standard hook-based orchestration layer does not apply. Without a strict rule, pages accumulate inline service calls and become untestable blobs.

### The Two Data Flow Paths

```
Client Component path (interactive UI):
  Component → Hook (useState/useEffect) → Service → Repository

Server Component path (RSC page):
  Page (thin render) → Loader (async fn) → Service → Repository
```

The **Loader** is the server-side equivalent of the Hook. It owns all orchestration for an RSC page.

### Loader Rules (STRICT)

1. **Every RSC page must have a co-located `page.loader.ts`** — no inline service calls in `page.tsx`
2. **The page file is render-only** — max ~30 lines, imports loader result, renders components
3. **Loaders accept a `deps` parameter with a default factory** — enables full unit testability with injected mock services
4. **Loaders return an explicitly typed `*PageData` object** — all fields typed, no implicit any
5. **Loaders call services only** — never repositories or data sources directly (no layer skipping)
6. **Loaders must have a co-located `page.loader.unit.spec.ts`** — tests inject mock deps
7. **Loaders are pure async functions** — no React, no state, no side effects

### File Naming Convention

```
app/
  page.tsx                          ← thin render
  page.loader.ts                    ← orchestration
  page.loader.unit.spec.ts          ← loader tests
  [feature]/
    page.tsx
    page.loader.ts
    page.loader.unit.spec.ts
    [slug]/
      page.tsx
      page.loader.ts
      page.loader.unit.spec.ts
```

### Loader Contract (Standard Shape)

```ts
// 1. Explicit deps type
type PageDeps = {
  someService: SomeService;
};

// 2. Default factory using real repositories
function createPageDeps(): PageDeps {
  return {
    someService: createSomeService(someRepository),
  };
}

// 3. Typed return
export type SomePageData = {
  items: Item[];
};

// 4. Injectable loader
export async function loadSomePage(deps: PageDeps = createPageDeps()): Promise<SomePageData> {
  const items = await deps.someService.getAll();
  return { items };
}
```

### Compliant Page Shape

```tsx
// app/some/page.tsx — THIN
import { loadSomePage } from './page.loader';
import { SomeList } from '@/features/some/components/SomeList';

export default async function SomePage() {
  const { items } = await loadSomePage();
  return <SomeList items={items} />;
}
```

### Violations (Not Allowed)

- Calling `createXxxService(xxxRepository)` inside `page.tsx`
- Calling service methods directly inside `page.tsx`
- Loaders calling repositories directly
- Loaders with no unit tests
- Pages longer than ~30 lines due to inline orchestration

---

---

# 🎨 8. UI Architecture

---

## Layers

- `/components` → shared, dumb UI components
- `/features/*/components` → feature-specific UI
- `/packages/ui` → design system components (brand-agnostic)
- `/packages/tokens` → design tokens (pure CSS custom properties)

---

## Design System

- Pure CSS token-based architecture (no CSS-in-JS)
- White-label compatible via brand CSS presets in `packages/tokens/src/brands/`
- Theme support: system (default), dark, light via CSS custom properties
- Components use semantic CSS variables (`var(--color-bg-primary)`), never hardcoded values
- Brand selection at build time via `NEXT_PUBLIC_BRAND` env var and `prebuild` script

See [docs/design-system.md](./design-system.md) for full design system architecture.

---

## Rules

- No business logic inside components
- Max component size ~200 lines
- Prefer composition over inheritance
- No hardcoded color/font values — use CSS variables

---

# 🧪 9. Testing Architecture

---

## Mandatory

- Services must have unit tests
- Complex transformations must be tested

---

## Optional

- Hooks (if logic-heavy)
- UI (only critical paths)

---

## Not Required

- Styling tests
- Snapshot-heavy tests

---

# 🔐 10. Shared Code Strategy

---

## Allowed Shared Locations

- `/lib` → utilities (pure functions only)
- `/packages/tokens` → design tokens (pure CSS)
- `/packages/ui` → design system components
- `/packages/config` → shared configs (ESLint, TypeScript)

---

## Restrictions

- No domain logic in `/lib`
- No feature leakage into shared modules

---

# 🚀 11. Scalability Constraints

The architecture must support:

---

## 1. Replaceable Data Source

- MDX → CMS migration should not affect UI

---

## 2. Feature Expansion

- New features must not modify existing ones

---

## 3. Agent Evolution

- Ability to add:
  - embeddings
  - semantic search
  - query APIs

---

# ⚠️ 12. Anti-Patterns (Strictly Forbidden)

- Fetching data inside components
- Mixing UI and business logic
- Large monolithic services
- Cross-feature tight coupling
- Using `any` type

---

# 🧱 13. Definition of Architectural Compliance

A feature is considered compliant if:

- It follows the layer structure
- It respects dependency rules
- It uses repositories for data access
- It isolates business logic in services

---

# 📌 Final Note

This document is **enforceable**, not advisory.

Any deviation must be:

- explicitly documented
- justified with trade-offs

---
