# 🚀 Arun Dev Platform

A high-performance, agent-first portfolio platform built to showcase engineering excellence, technical depth, and real-world impact.

---

## 🧠 Vision

This is not just a portfolio website.

It is a **developer platform** designed to:

- Attract recruiters through **impact-driven case studies**
- Engage learners via **high-quality technical content**
- Enable intelligent exploration through an **agent-first architecture**

---

## 🎯 Objectives

### 1. Recruiter-Focused Experience

- Highlight **real-world impact**, not just projects
- Emphasize:
  - scalability
  - performance optimizations
  - architectural decisions

- Provide quick, scannable insights

---

### 2. Learner & Peer Engagement

- Publish **deep technical blog articles**
- Focus on:
  - frontend architecture
  - browser APIs
  - performance engineering

- Ensure content is:
  - structured
  - searchable
  - reusable

---

### 3. Agent-First Development

- All content is **structured and machine-readable**
- Designed for:
  - AI querying
  - semantic search
  - future conversational interfaces

---

### 4. Engineering Excellence

- Modular and decoupled architecture
- Domain-driven design (DDD-lite)
- Test-driven development (TDD-first mindset)

---

## 🏗️ Architecture Overview

The system follows a layered architecture inspired by Clean Architecture:

```
Presentation Layer (Next.js UI)
        ↓
Application Layer (Hooks / Services)
        ↓
Domain Layer (Entities / Business Logic)
        ↓
Infrastructure Layer (Content, APIs, CMS)
```

### Key Principles

- UI is **decoupled** from data sources
- Business logic lives in **services**, not components
- Data access is handled via **repositories**
- Each feature is **isolated and modular**

---

## 🧩 Tech Stack

### Frontend

- Next.js **16.2.0** (App Router, React Server Components)
- TypeScript (strict mode)

### Styling

- Tailwind CSS (with design tokens)
- Scalable theming system

### Content & Data

- MDX for blog articles
- Structured JSON/TS for:
  - projects
  - experience
  - achievements

### Search

- Local search (FlexSearch / MiniSearch)
- Optional: Algolia

### Testing

- Vitest (unit testing)
- React Testing Library (component testing)
- Playwright (end-to-end testing)

### Tooling

- Turborepo / Nx (monorepo setup)
- ESLint + Prettier

---

## 📁 Project Structure

```
apps/
  web/                # Next.js application

packages/
  ui/                 # Reusable design system
  config/             # Shared configs

docs/
  architecture.md
  tech-stack.md
  folder-structure.md
```

---

## 🧱 Core Domains

The system is organized around feature-based domains:

- **profile** → personal info, experience, skills
- **projects** → case studies with impact metrics
- **articles** → technical blogs (MDX-based)
- **achievements** → certifications, awards
- **agent** → AI query layer and structured data access

---

## 🔌 Data Flow

All data access follows a strict pattern:

```
Component → Hook → Service → Repository → Data Source
```

This ensures:

- decoupling
- testability
- flexibility to switch data sources

---

## 🤖 Agent-First Design

This platform is built for machine understanding.

### Content is structured as:

- entities (projects, articles, experience)
- metadata (tags, difficulty, tech stack)
- relationships (skills ↔ projects ↔ articles)

### Enables:

- semantic search
- intelligent filtering
- future “Ask Arun” conversational interface

---

## 🧪 Testing Philosophy

- Focus on **business logic and services**
- Avoid over-testing UI
- Prefer:
  - unit tests for domain logic
  - integration tests for data flow
  - E2E tests for critical user journeys

---

## 🧭 Development Principles

- No tight coupling between modules
- No direct data fetching inside UI components
- Prefer composition over inheritance
- Keep components small and focused
- All decisions should be **scalable and maintainable**

---

## 🚦 Current Status

🚧 Initial setup phase

- [x] Vision defined
- [x] Architecture planned
- [x] Agent rules (AGENT.md)
- [x] Monorepo setup
- [ ] Design system foundation
- [ ] Data schema definition

---

## 🔮 Future Enhancements

- AI-powered portfolio assistant
- Personalized recruiter views
- Advanced analytics dashboard
- Interactive technical demos (lab section)

---

## 👨‍💻 About Me

Senior Frontend Engineer specializing in:

- React & modern frontend architecture
- Performance optimization
- Scalable UI systems
- Browser APIs and deep web platform knowledge

---

## 📌 Note

This project prioritizes **quality over speed**.

Every layer is designed with:

- clarity
- scalability
- long-term maintainability

---

## 📬 Contact

(Will be added)

---
