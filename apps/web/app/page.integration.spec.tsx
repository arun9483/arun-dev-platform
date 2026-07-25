import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { loadHomePage } from './page.loader';
import { FeaturedProjects } from '@/features/projects/components/FeaturedProjects';
import { FeaturedArticles } from '@/features/articles/components/FeaturedArticles';
import { FeaturedAchievements } from '@/features/achievements/components/FeaturedAchievements';

// Integration: home's below-the-fold sections stream behind Suspense, so the
// page unit test cannot reach them. These render the real deferred promises
// from the loader to prove real content still flows through each section.
describe('home streamed sections (integration)', () => {
  it('renders every real featured project from the deferred promise', async () => {
    const { featuredProjects } = await loadHomePage();
    const projects = await featuredProjects;
    expect(projects.length).toBeGreaterThan(0);

    render(await FeaturedProjects({ projects: featuredProjects }));
    for (const project of projects) {
      expect(screen.getAllByText(project.title).length).toBeGreaterThan(0);
    }
  });

  it('renders every real featured article from the deferred promise', async () => {
    const { featuredArticles } = await loadHomePage();
    const articles = await featuredArticles;
    expect(articles.length).toBeGreaterThan(0);

    render(await FeaturedArticles({ articles: featuredArticles }));
    for (const article of articles) {
      expect(screen.getAllByText(article.title).length).toBeGreaterThan(0);
    }
  });

  it('renders every real featured achievement from the deferred promise', async () => {
    const { featuredAchievements } = await loadHomePage();
    const achievements = await featuredAchievements;
    expect(achievements.length).toBeGreaterThan(0);

    render(await FeaturedAchievements({ achievements: featuredAchievements }));
    for (const achievement of achievements) {
      expect(screen.getAllByText(achievement.title).length).toBeGreaterThan(0);
    }
  });
});
