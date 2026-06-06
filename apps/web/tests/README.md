# Tests

## Folder structure

| Path       | Purpose                                        | Runner                       |
| ---------- | ---------------------------------------------- | ---------------------------- |
| `e2e/`     | End-to-end tests — cross-feature user journeys | Playwright (`*.e2e.spec.ts`) |
| `setup.ts` | Shared Vitest setup — jest-dom matchers        | Vitest                       |

Playwright MCP review screenshots are saved to `screenshots/` at the **monorepo root** — not here. See `/.gitignore` and `/.claude/settings.json`.
