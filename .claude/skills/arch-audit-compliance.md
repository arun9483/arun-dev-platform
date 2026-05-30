---
name: arch:audit-compliance
description: Audit the working tree against CLAUDE.md §3, §5, §8, §9 — layered-architecture structural rules. Reports cross-feature imports, UI→repository leaks, oversized pages/components, missing service specs, missing page loaders, repository business logic, and lib feature-coupling. Use this before pushing to main, or after large refactors. Read-only — never edits source.
---

# arch:audit-compliance

Structural compliance audit for this monorepo's layered architecture. Runs against the working tree, reports violations grouped by rule, and exits clean if nothing's wrong.

## When to invoke

- Before a direct push to `main`.
- After a refactor that crosses feature boundaries.
- Periodically — say once a sprint — for a clean-slate snapshot.

## How to run

For each rule below, use the listed tool with the exact pattern given. Report findings as a single markdown table at the end, then a one-line summary.

Use `Grep` for content searches, `Bash` (`find`, `wc -l`) for filesystem and line-count checks, and `Read` only when you need to look at a specific file. Do not write files. Do not modify code. The audit is read-only.

Work from the repo root.

## The 8 rules

| #   | Rule                                                  | Severity | What to do                                                                                                                                                                                                                                                  |
| --- | ----------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **§3.1 UI must not import repositories**              | error    | `Grep` for pattern `from ['"](\.\./)*\.\./repositories/\|from ['"]@?/?features/[^/]+/repositories/` in paths matching `apps/web/{app/**/page.tsx,app/**/layout.tsx,components/**,features/*/components/**,features/*/hooks/**}`. Each match is a violation. |
| 2   | **§3.3 Repos must be pure I/O**                       | warn     | `Grep` for `\.filter\([^)]*\bmetadata\b\|\.sort\(\|\.reduce\(` in `apps/web/features/*/repositories/*.ts`. Exclude `*.spec.*`. Heuristic — domain-entity filtering/sorting/reducing in a repo suggests business logic that belongs in a service.            |
| 3   | **§3.4 No cross-feature imports**                     | error    | For each `apps/web/features/<A>/**/*.{ts,tsx}` excluding `*.spec.*`: `Grep` for `from ['"]@/features/<B>/` where `B ≠ A`. Each match is a violation. Spec files are exempt.                                                                                 |
| 4   | **§3.7 Every page.tsx has a sibling page.loader.ts**  | error    | `Bash`: `find apps/web/app -name page.tsx` → for each, check `dirname/page.loader.ts` exists. Missing = error.                                                                                                                                              |
| 5   | **§3.7 page.tsx is render-only (≤ 50 lines)**         | warn     | `Bash`: `wc -l apps/web/app/**/page.tsx`. Anything > 50 lines is a warning. The CLAUDE.md spec says ~30 but 50 is the working threshold to avoid noise on the home page.                                                                                    |
| 6   | **§5 lib/ must not import from features**             | error    | `Grep` for `from ['"]@/features/\|from ['"](\.\./)+features/` in `apps/web/lib/**/*.{ts,tsx}` excluding `*.spec.*`. Each match is a violation.                                                                                                              |
| 7   | **§8 Every service has a co-located \*.unit.spec.ts** | error    | `Bash`: `find apps/web/features/*/services -name '*.ts' -not -name '*.spec.*'` → for each, check the sibling `<name>.unit.spec.ts` exists. Missing = error.                                                                                                 |
| 8   | **§9 Feature components are ≤ 200 lines**             | warn     | `Bash`: `wc -l` over `apps/web/components/*.tsx` and `apps/web/features/*/components/*.tsx`, excluding `*.spec.*`. Anything > 200 is a warning.                                                                                                             |

## Output format

Print exactly this shape so output is consistent across runs:

```
[arch:audit-compliance]

Errors (N):
  - [<rule-id>] <relative-path>:<line?> — <one-line message>
  - …

Warnings (N):
  - [<rule-id>] <relative-path>:<line?> — <one-line message>
  - …

Summary: <X> error(s), <Y> warning(s) across 8 rule(s).
```

Where `<rule-id>` is one of: `ui-no-repository-import`, `repository-no-business-logic`, `cross-feature-import`, `page-must-have-loader`, `page-tsx-max-lines`, `lib-no-feature-imports`, `service-must-have-spec`, `feature-component-max-lines`.

If a section has zero findings, omit that section entirely. If both are empty, print only:

```
[arch:audit-compliance]
✅ All 8 rules pass.
```

## Exit posture

- Errors present → end with: "Fix the errors above before pushing to main."
- Only warnings → end with: "Safe to push — warnings are informational."
- Clean → end with: "Safe to push."

## Don'ts

- Don't modify source files.
- Don't suggest fixes inline — the user can ask follow-up if they want guidance.
- Don't run tests or lint; this is a structural audit only.
- Don't recurse into `node_modules`, `.next`, `.turbo`, `coverage`, or `__mocks__`.
