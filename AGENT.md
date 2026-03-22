# 🤖 AGENT.md — Engineering Rules for Arun Dev Platform

This document defines how an AI coding agent must behave while working in this repository.

You must strictly follow these rules.
If there is any ambiguity, **ask before implementing**.

---

# 🧠 1. Project Context

This project is a **developer platform**, not just a portfolio.

It serves three primary audiences:

1. **Recruiters**
   - Need fast, high-signal insights
   - Focus on impact, scalability, and outcomes

2. **Learners / Peers**
   - Need deep technical content
   - Expect structured, high-quality explanations

3. **Agent / AI Systems**
   - Content must be machine-readable
   - Supports querying, summarization, and semantic search

---

# 🎯 2. Core Objectives

You must ensure all implementations support:

- Modular architecture
- Clear separation of concerns
- Agent-first data modeling
- High performance (Lighthouse-friendly)
- Maintainability and scalability

---

# 🏗️ 3. Architecture Rules (STRICT)

The system follows a layered architecture:

```
UI (Next.js)
  ↓
Hooks / Application Layer
  ↓
Services (Business Logic)
  ↓
Repositories (Data Access)
  ↓
Data Source (MDX / JSON / CMS)
```

---

## ❗ Mandatory Rules

### 3.1 No Direct Data Access from UI

❌ DO NOT:

- Fetch data inside components
- Import JSON/MDX directly in UI

✅ ALWAYS:

- Use hooks → services → repositories

---

### 3.2 Business Logic Placement

- Must live in **services**
- Never inside:
  - components
  - pages
  - hooks (hooks only orchestrate)

---

### 3.3 Repository Pattern

- All data access must go through repositories
- Repositories abstract:
  - MDX
  - APIs
  - CMS

---

### 3.4 Feature Isolation

Each feature must be self-contained:

```
feature/
  components/
  hooks/
  services/
  repositories/
  types/
```

---

# 🧩 4. Technology Constraints

You must use:

- Next.js **16.2.0**
- TypeScript (strict mode)
- App Router

---

## ❗ Restrictions

- No `any` type
- No implicit types
- No unused dependencies
- Do not introduce new libraries without justification
- All dependencies must use **exact pinned versions** (e.g., `"16.2.0"`, not `"^16.2.0"`)
- No range operators (`^`, `~`, `>=`, `*`) in `dependencies` or `devDependencies`
- Exception: `peerDependencies` may use `>=` and `workspace:*` for monorepo packages

---

# 📁 5. Folder Structure Rules

You must follow this structure:

```
apps/web/
  app/
  components/        # shared UI only
  features/          # domain modules
  lib/               # utilities
  styles/

packages/
  ui/
  config/
```

---

## ❗ Rules

- Do NOT mix feature logic in `/components`
- Do NOT create global “utils” for feature logic
- Keep domain logic inside feature folders

---

# 🔌 6. Data Flow Rules

All data must follow this flow:

```
Component → Hook → Service → Repository → Data Source
```

---

## Responsibilities

| Layer       | Responsibility |
| ----------- | -------------- |
| Component   | UI rendering   |
| Hook        | orchestration  |
| Service     | business logic |
| Repository  | data fetching  |
| Data Source | raw data       |

---

# 🧪 7. Testing Rules (TDD-FIRST)

You must follow a **TDD-first mindset**.

---

## Test File Naming Convention (STRICT)

All test files follow the `<name>.<type>.spec.ts(x)` pattern:

| Type        | Pattern                    | Runner     | Location                    |
| ----------- | -------------------------- | ---------- | --------------------------- |
| Unit        | `*.unit.spec.ts(x)`        | Vitest     | Co-located with source file |
| Integration | `*.integration.spec.ts(x)` | Vitest     | Co-located with source file |
| E2E         | `*.e2e.spec.ts(x)`         | Playwright | `tests/e2e/` directory      |

---

## Test Location Rules

- Unit and integration tests are **co-located** next to the source file they test
- E2E tests live in `tests/e2e/` (cross-feature user journeys)
- Shared test infrastructure (setup files, fixtures, mocks) lives in `tests/`
- Each test type has a dedicated vitest config (`vitest.unit.config.ts`, `vitest.integration.config.ts`)

---

## ✅ Must Write Tests For:

- Services (business logic)
- Domain transformations
- Critical data flows

---

## ⚠️ Optional Tests:

- UI components (only for critical behavior)

---

## ❌ Avoid:

- Snapshot-heavy testing
- Testing implementation details

---

# 🎨 8. UI & Component Rules

- Components must be:
  - small
  - reusable
  - presentational

---

## ❗ Constraints

- Max ~200 lines per component
- No business logic inside components
- Use composition over inheritance

---

# 🧠 9. Agent-First Data Modeling

All content must be structured.

---

## Example: Project Entity

```
- title
- description
- problem
- solution
- techStack
- impact
- tags
```

---

## Rules

- Always include metadata
- Prefer structured fields over free text
- Make data queryable

---

# 🤖 10. Agent Behavior Rules

These rules define how YOU (the agent) must operate.

---

## ✅ Before Writing Code

You MUST:

1. Explain your approach
2. Reference architecture rules
3. Confirm assumptions (if unclear)

---

## ✅ While Writing Code

- Follow folder structure strictly
- Keep functions small and focused
- Ensure type safety

---

## ❌ Never Do

- Do not bypass architecture layers
- Do not introduce hidden coupling
- Do not assume missing requirements
- Do not add libraries without explanation
- Do not read, print, or reference contents of `.env.local`, `.env.production`, `.env.staging`, or any `.env.*` file (except `.env.example`)
- Do not include environment variable values in code suggestions or output

---

## ⚠️ If You Are Unsure

You MUST:

- Ask clarifying questions
- Propose multiple approaches if needed

---

# 🚀 11. Performance Expectations

- Optimize for:
  - fast load times
  - minimal JS bundle
  - server-first rendering

---

## Prefer:

- React Server Components
- Static generation (SSG)
- Incremental Static Regeneration (ISR)

---

# 🧭 12. Code Quality Standards

- Clean, readable code
- Meaningful naming
- No dead code
- No console logs in production code

---

# 🔄 13. Iteration Workflow

You must follow this workflow:

1. Understand requirement
2. Explain approach
3. Wait for approval (if needed)
4. Implement
5. Add tests
6. Ensure alignment with architecture

---

# 🧱 14. Definition of Done

A task is complete only if:

- Architecture rules are followed
- Code is type-safe
- Tests (where applicable) are written
- No tight coupling introduced
- Code is readable and maintainable

---

# 📌 Final Instruction

You are not just writing code.

You are acting as a **senior engineer contributing to a scalable system**.

Prioritize:

- clarity over cleverness
- structure over shortcuts
- long-term maintainability over quick fixes

---
