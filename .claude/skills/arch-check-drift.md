---
name: arch:check-drift
description: Detect whether CLAUDE.md sections that the arch:audit-compliance skill enforces (§3.1, §3.3, §3.4, §3.7, §5, §8, §9) have changed since the last commit. Use after editing CLAUDE.md, or before pushing, to verify that the audit skill's rule-list still matches the spec. Read-only — never edits anything.
---

# arch:check-drift

Guards against the situation where the human-readable spec (CLAUDE.md) gets updated but the machine enforcement (`arch:audit-compliance`) does not. Uses git as the audit trail — no sidecar files or hash registries.

## When to invoke

- After editing CLAUDE.md.
- Before a push to `main` (cheap sanity check; takes a few seconds).
- Whenever you want to know "did anything spec-relevant change since the last commit?".

## How to run

1. Run `Bash`: `git status --porcelain CLAUDE.md` — is the file modified?
2. Run `Bash`: `git diff HEAD -- CLAUDE.md` — capture the unstaged + staged diff against the last commit.
3. Parse the diff. Identify which **section** each changed hunk falls inside by walking the surrounding lines backwards until a `## ` or `### ` heading.
4. Match each affected section against the rule-bearing set (see below). Sections outside this set are ignored — they cannot affect the audit.
5. If at least one rule-bearing section changed, produce the report shape in **Output format** below. Otherwise produce the clean-state report.

If `CLAUDE.md` is unchanged in the working tree, you are done — print the clean-state report immediately. Skip the diff parse.

## Rule-bearing sections (must monitor)

| CLAUDE.md section                  | Rule enforced by arch:audit-compliance    |
| ---------------------------------- | ----------------------------------------- |
| §3.1 No Direct Data Access from UI | ui-no-repository-import                   |
| §3.3 Repository Pattern            | repository-no-business-logic              |
| §3.4 Feature Isolation             | cross-feature-import                      |
| §3.7 RSC Loader Pattern            | page-must-have-loader, page-tsx-max-lines |
| §5 Folder Structure Rules          | lib-no-feature-imports                    |
| §8 Testing Rules                   | service-must-have-spec                    |
| §9 UI & Component Rules            | feature-component-max-lines               |

Any change outside these sections is unrelated to the audit — do not report it.

## Output format

### Clean state

```
[arch:check-drift]
✅ CLAUDE.md unchanged in rule-bearing sections.
```

### Drift detected

```
[arch:check-drift]
Spec changes detected in rule-bearing sections:

§3.4 Feature Isolation
  + (added line, copied verbatim from diff)
  - (removed line, copied verbatim from diff)

§5 Folder Structure Rules
  …

These changes may require the arch:audit-compliance skill to be updated
so its rule list stays in sync. Decide for each section:

  - Clarification only — no audit change needed.
  - Rule update — open .claude/skills/arch-audit-compliance.md and revise
    the relevant row of the rule table.

To confirm reviewed and accept the new state, commit CLAUDE.md.
```

Quote the diff lines exactly as they appear — don't paraphrase. The user needs to see the precise wording change to judge intent.

## Boundaries

- Read-only. Don't edit CLAUDE.md or the audit skill. The user decides what's a clarification vs. a rule change.
- Don't run the audit. That's `arch:audit-compliance`'s job.
- Don't analyze sections outside the rule-bearing set, even if they changed.
- If `CLAUDE.md` is staged but not yet committed, the diff still works — the comparison is against `HEAD`.
- If multiple commits exist between when the audit skill was last reviewed and now, the diff against `HEAD` only catches uncommitted state. To check committed drift, the user can run `git log -p -- CLAUDE.md` manually; that's outside the scope of this skill.
