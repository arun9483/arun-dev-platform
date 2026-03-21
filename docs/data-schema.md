# 🧬 Data Schema — Arun Dev Platform

This document defines the **canonical data models, contracts, and relationships** used across the platform.

It is **strict and enforceable**.
All data must conform to these schemas.

---

# 🧠 1. Schema Philosophy

The system is **agent-first**, which means:

- Data must be **structured**
- Data must be **typed**
- Data must be **queryable**
- Data must be **consistent across domains**

---

## ❗ Core Rules

- No unstructured blobs when structured fields are possible
- All entities must include metadata
- All schemas must be TypeScript-compatible
- Prefer explicit fields over nested ambiguity

---

# 🧱 2. Common Base Fields

All entities must include:

```id="base-schema"
BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}
```

---

## Optional Metadata (Recommended)

```id="meta-schema"
Metadata {
  tags: string[]
  category?: string
  featured?: boolean
}
```

---

# 🧩 3. Core Entities

---

# 🧑‍💼 3.1 Profile

Represents personal and professional identity.

```id="profile-schema"
Profile {
  id: string
  name: string
  title: string
  summary: string
  location?: string

  skills: Skill[]

  experience: Experience[]

  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
}
```

---

## Skill

```id="skill-schema"
Skill {
  name: string
  category: "frontend" | "backend" | "tools" | "other"
  level?: "beginner" | "intermediate" | "advanced" | "expert"
}
```

---

## Experience

```id="experience-schema"
Experience {
  company: string
  role: string
  startDate: string
  endDate?: string

  highlights: string[]

  techStack: string[]
}
```

---

# 🚀 3.2 Project

Core entity for recruiter attraction.

```id="project-schema"
Project {
  id: string
  title: string
  description: string

  problem: string
  solution: string

  techStack: string[]

  impact: ImpactMetric[]

  links: {
    github?: string
    live?: string
  }

  metadata: Metadata
}
```

---

## ImpactMetric

```id="impact-schema"
ImpactMetric {
  label: string        // e.g. "Performance improvement"
  value: string        // e.g. "40% faster load time"
}
```

---

# 📝 3.3 Article

MDX-based content with structured metadata.

```id="article-schema"
Article {
  id: string
  title: string
  description: string

  slug: string

  publishedAt: string
  updatedAt?: string

  readingTime?: number

  metadata: {
    tags: string[]
    category?: string
    level?: "beginner" | "intermediate" | "advanced"
  }
}
```

---

# 🏆 3.4 Achievement

Represents certifications, awards, or recognitions.

```id="achievement-schema"
Achievement {
  id: string
  title: string
  issuer: string

  date: string

  description?: string

  credentialUrl?: string

  metadata: Metadata
}
```

---

# 🤖 3.5 Agent Query Models

These are derived, not stored directly.

---

## Query Input

```id="query-input"
AgentQuery {
  query: string
  filters?: {
    tags?: string[]
    category?: string
    techStack?: string[]
  }
}
```

---

## Query Result

```id="query-result"
AgentResult<T> {
  items: T[]
  total: number
}
```

---

# 🔗 4. Relationships Between Entities

---

## Explicit Relationships

- `Project.techStack` ↔ `Skill.name`
- `Article.metadata.tags` ↔ `Project.metadata.tags`
- `Experience.techStack` ↔ `Skill.name`

---

## Implicit Relationships (via tags)

- Projects ↔ Articles
- Articles ↔ Skills
- Achievements ↔ Skills

---

## Rule

- Relationships must be **derivable without hardcoding links**

---

# 🔍 5. Queryability Requirements

All entities must support:

- filtering by tags
- filtering by tech stack
- sorting (date, relevance)
- search (text-based)

---

---

# 🧪 6. Validation Rules

---

## Required

- All required fields must be present
- IDs must be unique
- Dates must be ISO strings

---

## Recommended

- Validate at repository level
- Fail early on invalid data

---

---

# 📦 7. Data Source Mapping

---

## Source Types

| Entity       | Source    |
| ------------ | --------- |
| Profile      | JSON / TS |
| Projects     | JSON / TS |
| Articles     | MDX       |
| Achievements | JSON / TS |

---

---

# ⚠️ 8. Anti-Patterns (Strictly Forbidden)

- Unstructured markdown without metadata
- Deeply nested unpredictable objects
- Mixing multiple entity types in one structure
- Hardcoded relationships

---

---

# 🧱 9. Extensibility Guidelines

---

## Adding New Fields

- Must not break existing schema
- Must be optional initially

---

## Adding New Entity

- Define schema here first
- Then implement in features

---

---

# 📌 10. Definition of Schema Compliance

The system is compliant if:

- All data matches defined schemas
- Relationships are derivable
- Data is structured and queryable
- No untyped or loosely typed data exists

---

---

# 🧭 Final Note

This schema is the **foundation of the agent-first system**.

It directly impacts:

- search quality
- AI capabilities
- maintainability

---

Treat schema design as a **first-class engineering decision**, not an afterthought.

---
