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

---

# 🎨 8. UI Architecture

---

## Layers

- `/components` → shared, dumb UI components
- `/features/*/components` → feature-specific UI

---

## Rules

- No business logic inside components
- Max component size ~200 lines
- Prefer composition over inheritance

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
- `/packages/ui` → design system
- `/packages/config` → shared configs

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
