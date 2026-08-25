import type { BadgeTone } from '@arun-dev/ui';
import type { ArticleDifficulty } from '../types';

type DifficultyPresentation = { label: string; tone: BadgeTone };

/**
 * Difficulty is article vocabulary, so the mapping onto a design-system tone lives
 * here rather than in @arun-dev/ui. `satisfies` keeps every difficulty covered and
 * every tone spelled correctly.
 */
export const DIFFICULTY = {
  beginner: { label: 'Beginner', tone: 'success' },
  intermediate: { label: 'Intermediate', tone: 'warning' },
  advanced: { label: 'Advanced', tone: 'error' },
} as const satisfies Record<ArticleDifficulty, DifficultyPresentation>;

/**
 * Content is authored in MDX front matter, so a difficulty outside the known set can
 * reach the UI. Fall back to showing the raw value with no tone rather than dropping it.
 */
export function difficultyPresentation(value: string): DifficultyPresentation {
  return DIFFICULTY[value as ArticleDifficulty] ?? { label: value, tone: 'neutral' };
}
