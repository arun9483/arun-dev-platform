# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

You must strictly follow these rules. If there is any ambiguity, ask before implementing.

## 1. Project Context

This project is a developer platform, not just a portfolio. It is a high-performance, agent-first platform built to showcase engineering excellence, technical depth, and real-world impact.

It serves three primary audiences:

1. Recruiters - Need fast, high-signal insights. Focus on impact, scalability, and outcomes.
2. Learners / Peers - Need deep technical content. Expect structured, high-quality explanations.
3. Agent / AI Systems - Content must be machine-readable. Supports querying, summarization, and semantic search.

The platform is designed to:

- Attract recruiters through impact-driven case studies
- Engage learners via high-quality technical blog articles (frontend architecture, browser APIs, performance engineering)
- Enable intelligent exploration through agent-first architecture (AI querying, semantic search, future conversational interfaces)
- Follow domain-driven design (DDD-lite) and test-driven development (TDD-first mindset)

This project prioritizes quality over speed.

## 2. Core Objectives

All implementations must support:

- Modular architecture
- Clear separation of concerns
- Agent-first data modeling
- High performance (Lighthouse-friendly, target score ~100)
- Maintainability and scalability

## 3. Architecture Rules (STRICT)

The system follows a layered architecture inspired by Clean Architecture:

```
Presentation Layer - UI (Next.js)
        ↓
Application Layer - Hooks (orchestration)
        ↓
Domain Layer - Services (Business Logic)
        ↓
Infrastructure Layer - Repositories (Data Access)
        ↓
Data Source (MDX / JSON / CMS)
```

### 3.1 No Direct Data Access from UI

DO NOT:

- Fetch data inside components
- Import JSON/MDX directly in UI

ALWAYS:

- Use hooks -> services -> repositories

### 3.2 Business Logic Placement

- Must live in services
- Never inside components, pages, or hooks (hooks only orchestrate)

### 3.3 Repository Pattern

- All data access must go through repositories
- Repositories abstract MDX, APIs, and CMS
- Repositories fetch and normalize data — no business logic in repositories

### 3.4 Feature Isolation

Each feature must be self-contained:

```
features/<feature-name>/
  components/    # Feature-specific UI, no business logic
  hooks/         # Orchestrate data flow, call services, manage UI state
  services/      # Business logic, data transformation, filtering, sorting
  repositories/  # Data fetching and normalization, no business logic
  types/         # TypeScript types and interfaces
```

### 3.5 Data Flow

The system has two data flow paths depending on rendering context:

**Client Component path (interactive UI):**

```
Component → Hook → Service → Repository → Data Source
```

**Server Component path (RSC page):**

```
Page (thin render) → Loader → Service → Repository → Data Source
```

| Layer         | Client path               | Server path       |
| ------------- | ------------------------- | ----------------- |
| Component     | UI rendering              | UI rendering      |
| Orchestration | Hook (useState/useEffect) | Loader (async fn) |
| Service       | business logic            | business logic    |
| Repository    | data fetching             | data fetching     |
| Data Source   | raw data                  | raw data          |

### 3.6 Dependency Direction

```
components → hooks/loaders → services → repositories
```

- No reverse dependency
- No skipping layers

### 3.7 RSC Loader Pattern (STRICT)

React hooks cannot run in Server Components. Every RSC `page.tsx` must delegate all data fetching to a co-located `page.loader.ts`. This keeps pages thin, testable, and compliant with the layered architecture.

**Rules:**

- Every `app/**/page.tsx` must have a co-located `page.loader.ts`
- `page.tsx` must be render-only — max ~30 lines, zero inline service or repository calls
- Loaders accept a `deps` parameter with a default factory (constructor injection for testability)
- Loaders return an explicitly typed `*PageData` object
- Loaders call services only — never repositories or data sources directly
- Loaders must have a co-located `page.loader.unit.spec.ts`
- Loaders are pure async functions — no React, no state

**Standard loader shape:**

```ts
// Deps type — one entry per service needed
type PageDeps = { someService: SomeService };

// Default factory — wires real repositories
function createPageDeps(): PageDeps {
  return { someService: createSomeService(someRepository) };
}

// Typed return
export type SomePageData = { items: Item[] };

// Injectable loader
export async function loadSomePage(deps: PageDeps = createPageDeps()): Promise<SomePageData> {
  const items = await deps.someService.getAll();
  return { items };
}
```

**Compliant page shape:**

```tsx
// app/some/page.tsx — thin render only
import { loadSomePage } from './page.loader';
import { SomeList } from '@/features/some/components/SomeList';

export default async function SomePage() {
  const { items } = await loadSomePage();
  return <SomeList items={items} />;
}
```

**NEVER do:**

```tsx
// ❌ Forbidden — service calls inline in page.tsx
export default async function SomePage() {
  const service = createSomeService(someRepository);
  const items = await service.getAll();
  return <SomeList items={items} />;
}
```

See `docs/architecture.md §7.1` for full specification.

## 4. Technology Constraints

You must use:

- Next.js 16.2.0 (App Router mandatory, React Server Components default, Server Actions when needed)
- TypeScript (strict mode)

### TypeScript Rules

- `"strict": true`
- No `any` type
- No implicit types
- Prefer explicit types over inference (for domain models)
- Use `type` over `interface` (unless extension is required)

### Styling

- Tailwind CSS 4.x (CSS-first configuration, no JS config files)
- Pure CSS custom properties for design tokens — no CSS-in-JS
- Tokens live in `packages/tokens/` (pure CSS, publishable, white-label compatible)
- Brand selection via `NEXT_PUBLIC_BRAND` env var and `prebuild` script
- Theme support: system (default), dark, light via `data-theme` attribute
- No inline styles (except dynamic cases)
- No hardcoded color/font values — use CSS variables (`var(--token-name)`)
- Components must use semantic tokens (`--color-bg-primary`) over raw brand tokens
- See `docs/design-system.md` for full architecture

### Content & Data

- MDX for blog articles (must include frontmatter metadata)
- Structured TypeScript/JSON for projects, profile, achievements
- All content must be structured and typed
- No unstructured content blobs

### Search

- MiniSearch or FlexSearch (local search) as default
- Algolia optional (if scaling required)

### Testing Stack

- Vitest (unit testing)
- React Testing Library (component testing)
- Playwright (end-to-end testing)

### Linting & Formatting

- ESLint + Prettier
- No unused variables
- No console logs in production
- Consistent formatting enforced

### Monorepo

- Turborepo (preferred)

### Dependency Management

- Only well-maintained, widely adopted libraries
- No unnecessary dependencies
- No duplicate libraries solving the same problem
- Must justify bundle size impact and long-term maintenance
- Do not introduce new libraries without justification
- All dependencies must use **exact pinned versions** (e.g., `"16.2.0"`, not `"^16.2.0"` or `"~16.2.0"`)
- No range operators (`^`, `~`, `>=`, `*`) allowed in `dependencies` or `devDependencies`
- Exception: `peerDependencies` may use `>=` for consumer flexibility
- Exception: `workspace:*` for internal monorepo packages

### Deployment

- **Vercel** — native GitHub integration, auto-deploys on push to `main`
- **GitHub Actions** — CI pipeline on PRs (lint, format, typecheck, tests, build, e2e)
- **Pre-push hook** — local safeguard (lint, typecheck, tests) for direct pushes to `main`
- Preview deployments auto-created on every PR
- See `docs/deployment.md` for full deployment architecture

### Environment

- Use environment variables for configs
- Do not hardcode secrets
- Production env vars: Vercel Dashboard (Production scope)
- Preview env vars: Vercel Dashboard (Preview scope)
- Local dev: `apps/web/.env.local` (copy from `.env.example`)

### Sensitive Files (STRICT)

- NEVER read, cat, print, or reference the contents of `.env.local`, `.env.production`, `.env.staging`, or any `.env.*` file (except `.env.example`)
- NEVER include environment variable values in code suggestions, tool output, or conversation
- Only `.env.example` (with placeholder values, no real secrets) may be read or modified
- All real secrets must be configured in Vercel Dashboard or GitHub Secrets — never stored in the codebase

## 5. Folder Structure Rules (STRICT)

```
apps/
  web/                    # Next.js application
    app/                  # App Router — routes and layouts
    components/           # Shared UI components only (presentational, no business logic)
    features/             # Domain-based modules (core of the system)
      projects/
      articles/
      profile/
    lib/                  # Shared utilities (pure functions only, constants, generic helpers)
    styles/
      brand.css           # Generated brand re-export (gitignored, created by prebuild)
      themes/             # Theme switching logic (FOUC prevention script)
    tests/
      setup.ts          # Shared test setup (jest-dom matchers)
      e2e/              # E2E tests only (Playwright, *.e2e.spec.ts)

packages/
  tokens/                 # Design tokens (pure CSS, white-label compatible)
  ui/                     # Reusable design system components (brand-agnostic)
  config/                 # Shared configs (ESLint, TypeScript)

docs/                     # Architecture and system documentation
```

### Folder Rules

- Do NOT mix feature logic in `/components`
- Do NOT create global "utils" for feature logic
- Keep domain logic inside feature folders
- `lib/` is for pure utility functions, constants, and generic helpers only — no business logic, no feature-specific code

### Import Rules (STRICT)

Allowed imports:

| From    | Can Import                    |
| ------- | ----------------------------- |
| Feature | Its own modules               |
| Feature | Shared (`lib`, `packages`)    |
| Feature | Its own services/repositories |

Forbidden imports:

- Feature A importing Feature B directly
- Components importing repositories
- Services importing UI components

### Adding New Features

1. Create a new folder in `features/`
2. Follow the standard feature structure
3. Do not modify existing features

### Adding Shared Logic

- Place in `lib/` if generic
- Place in `packages/` if reusable across apps

### Anti-Patterns (Strictly Forbidden)

- Large global folders with mixed responsibilities
- Cross-feature tight coupling
- Business logic inside components
- Dumping everything into `lib/`
- Deep nested folder chaos

## 6. Core Domains

The system is organized around feature-based domains:

- profile — personal info, experience, skills
- projects — case studies with impact metrics
- articles — technical blogs (MDX-based)
- achievements — certifications, awards
- agent — AI query layer and structured data access

## 7. Agent-First Data Modeling

All content must be structured for machine understanding.

Content is structured as:

- Entities (projects, articles, experience)
- Metadata (tags, difficulty, tech stack)
- Relationships (skills <-> projects <-> articles)

Example project entity fields: title, description, problem, solution, techStack, impact, tags

Rules:

- Always include metadata
- Prefer structured fields over free text
- Make data queryable

This enables semantic search, intelligent filtering, AI summarization, and future "Ask Arun" conversational interface.

## 8. Testing Rules (TDD-FIRST)

Follow a TDD-first mindset.

### Test File Naming Convention (STRICT)

All test files follow the `<name>.<type>.spec.ts(x)` pattern:

| Type        | Pattern                    | Runner     | Location                    |
| ----------- | -------------------------- | ---------- | --------------------------- |
| Unit        | `*.unit.spec.ts(x)`        | Vitest     | Co-located with source file |
| Integration | `*.integration.spec.ts(x)` | Vitest     | Co-located with source file |
| E2E         | `*.e2e.spec.ts(x)`         | Playwright | `tests/e2e/` directory      |

### Test Location Rules

- Unit and integration tests are **co-located** next to the source file they test
- E2E tests live in `tests/e2e/` (cross-feature user journeys)
- Shared test infrastructure (setup files, fixtures, mocks) lives in `tests/`

### Vitest Configuration

- Each test type has a dedicated config: `vitest.unit.config.ts`, `vitest.integration.config.ts`
- Scripts use `--config` flag for isolated, non-mixed results
- Pre-commit hook runs unit tests only; integration and E2E run in CI

### Must Write Tests For

- Services (business logic)
- Domain transformations
- Critical data flows

### Optional Tests

- UI components (only for critical behavior)

### Avoid

- Snapshot-heavy testing
- Testing implementation details
- Excessive UI testing

### Prefer

- Unit tests for domain logic
- Integration tests for data flow
- E2E tests for critical user journeys

## 9. UI & Component Rules

Components must be small, reusable, and presentational.

Constraints:

- Max ~200 lines per component
- No business logic inside components
- Use composition over inheritance

## 10. Performance Expectations

Optimize for:

- Fast load times
- Minimal JS bundle
- Server-first rendering

Prefer:

- React Server Components (default)
- Static generation (SSG)
- Incremental Static Regeneration (ISR)

Goals:

- Minimal client-side JavaScript
- Fast initial load
- Lighthouse score ~100

## 11. Agent Behavior Rules

These rules define how you (the agent) must operate.

### Before Writing Code

You MUST:

1. Explain your approach
2. Reference architecture rules
3. Confirm assumptions (if unclear)

### Before Committing

You MUST:

1. Show the proposed commit message to the user
2. Wait for user confirmation before committing
3. Do not commit until the user approves the message

### While Writing Code

- Follow folder structure strictly
- Keep functions small and focused
- Ensure type safety

### Never Do

- Do not bypass architecture layers
- Do not introduce hidden coupling
- Do not assume missing requirements
- Do not add libraries without explanation

### If You Are Unsure

You MUST:

- Ask clarifying questions
- Propose multiple approaches if needed

## 12. Code Quality Standards

- Clean, readable code
- Meaningful naming
- No dead code
- No console logs in production code

## 13. Iteration Workflow

You must follow this workflow:

1. Understand requirement
2. Explain approach
3. Wait for approval (if needed)
4. Implement
5. Add tests
6. Ensure alignment with architecture

## 14. Definition of Done

A task is complete only if:

- Architecture rules are followed
- Code is type-safe
- Tests (where applicable) are written
- No tight coupling introduced
- Code is readable and maintainable

## 15. Final Instruction

You are not just writing code. You are acting as a senior engineer contributing to a scalable system.

Prioritize:

- Clarity over cleverness
- Structure over shortcuts
- Long-term maintainability over quick fixes
- Built-in capabilities over trendy tools
- Simplicity over unnecessary abstractions

# context-mode — MANDATORY routing rules

You have context-mode MCP tools available. These rules are NOT optional — they protect your context window from flooding. A single unrouted command can dump 56 KB into context and waste the entire session.

## BLOCKED commands — do NOT attempt these

### curl / wget — BLOCKED

Any Bash command containing `curl` or `wget` is intercepted and replaced with an error message. Do NOT retry.
Instead use:

- `ctx_fetch_and_index(url, source)` to fetch and index web pages
- `ctx_execute(language: "javascript", code: "const r = await fetch(...)")` to run HTTP calls in sandbox

### Inline HTTP — BLOCKED

Any Bash command containing `fetch('http`, `requests.get(`, `requests.post(`, `http.get(`, or `http.request(` is intercepted and replaced with an error message. Do NOT retry with Bash.
Instead use:

- `ctx_execute(language, code)` to run HTTP calls in sandbox — only stdout enters context

### WebFetch — BLOCKED

WebFetch calls are denied entirely. The URL is extracted and you are told to use `ctx_fetch_and_index` instead.
Instead use:

- `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` to query the indexed content

## REDIRECTED tools — use sandbox equivalents

### Bash (>20 lines output)

Bash is ONLY for: `git`, `mkdir`, `rm`, `mv`, `cd`, `ls`, `npm install`, `pip install`, and other short-output commands.
For everything else, use:

- `ctx_batch_execute(commands, queries)` — run multiple commands + search in ONE call
- `ctx_execute(language: "shell", code: "...")` — run in sandbox, only stdout enters context

### Read (for analysis)

If you are reading a file to **Edit** it → Read is correct (Edit needs content in context).
If you are reading to **analyze, explore, or summarize** → use `ctx_execute_file(path, language, code)` instead. Only your printed summary enters context. The raw file content stays in the sandbox.

### Grep (large results)

Grep results can flood context. Use `ctx_execute(language: "shell", code: "grep ...")` to run searches in sandbox. Only your printed summary enters context.

## Tool selection hierarchy

1. **GATHER**: `ctx_batch_execute(commands, queries)` — Primary tool. Runs all commands, auto-indexes output, returns search results. ONE call replaces 30+ individual calls.
2. **FOLLOW-UP**: `ctx_search(queries: ["q1", "q2", ...])` — Query indexed content. Pass ALL questions as array in ONE call.
3. **PROCESSING**: `ctx_execute(language, code)` | `ctx_execute_file(path, language, code)` — Sandbox execution. Only stdout enters context.
4. **WEB**: `ctx_fetch_and_index(url, source)` then `ctx_search(queries)` — Fetch, chunk, index, query. Raw HTML never enters context.
5. **INDEX**: `ctx_index(content, source)` — Store content in FTS5 knowledge base for later search.

## Subagent routing

When spawning subagents (Agent/Task tool), the routing block is automatically injected into their prompt. Bash-type subagents are upgraded to general-purpose so they have access to MCP tools. You do NOT need to manually instruct subagents about context-mode.

## Output constraints

- Keep responses under 500 words.
- Write artifacts (code, configs, PRDs) to FILES — never return them as inline text. Return only: file path + 1-line description.
- When indexing content, use descriptive source labels so others can `ctx_search(source: "label")` later.

## ctx commands

| Command       | Action                                                                                |
| ------------- | ------------------------------------------------------------------------------------- |
| `ctx stats`   | Call the `ctx_stats` MCP tool and display the full output verbatim                    |
| `ctx doctor`  | Call the `ctx_doctor` MCP tool, run the returned shell command, display as checklist  |
| `ctx upgrade` | Call the `ctx_upgrade` MCP tool, run the returned shell command, display as checklist |
