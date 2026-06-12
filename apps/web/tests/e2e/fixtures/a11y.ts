import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

import knownIssuesFile from '../a11y-known-issues.json';

type KnownIssue = {
  route: string;
  ruleId: string;
  justification: string;
  owner: string;
  expires: string;
};

type A11yViolationSummary = {
  ruleId: string;
  impact: string;
  description: string;
  targets: string[];
};

const knownIssues = (knownIssuesFile as { issues: KnownIssue[] }).issues;

/**
 * Gate: zero NEW serious/critical axe violations (wcag2a + wcag2aa).
 * Existing violations live in a11y-known-issues.json with owner + expiry;
 * expired entries stop being honored, forcing the burn-down.
 */
export async function checkA11y(page: Page, route: string): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  const today = new Date().toISOString().slice(0, 10);
  const allowedRuleIds = new Set(
    knownIssues
      .filter((issue) => issue.route === route && issue.expires >= today)
      .map((issue) => issue.ruleId),
  );

  const newViolations: A11yViolationSummary[] = results.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .filter((violation) => !allowedRuleIds.has(violation.id))
    .map((violation) => ({
      ruleId: violation.id,
      impact: violation.impact ?? 'unknown',
      description: violation.description,
      targets: violation.nodes.slice(0, 5).map((node) => node.target.join(' ')),
    }));

  expect(newViolations, `New serious/critical axe violations on ${route}`).toEqual([]);
}
