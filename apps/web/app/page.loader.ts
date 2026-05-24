import { profileRepository } from '@/features/profile/repositories/profileRepository';
import { createProfileService } from '@/features/profile/services/profileService';
import { projectsRepository } from '@/features/projects/repositories/projectsRepository';
import { createProjectsService } from '@/features/projects/services/projectsService';
import { articlesRepository } from '@/features/articles/repositories/articlesRepository';
import { createArticlesService } from '@/features/articles/services/articlesService';
import { achievementsRepository } from '@/features/achievements/repositories/achievementsRepository';
import { createAchievementsService } from '@/features/achievements/services/achievementsService';
import type { ProfileService } from '@/features/profile/services/profileService';
import type { ProjectsService } from '@/features/projects/services/projectsService';
import type { ArticlesService } from '@/features/articles/services/articlesService';
import type { AchievementsService } from '@/features/achievements/services/achievementsService';
import type { Profile, Skill } from '@/features/profile/types';
import type { Project } from '@/features/projects/types';
import type { ArticleMeta } from '@/features/articles/types';
import type { Achievement } from '@/features/achievements/types';

type HomePageDeps = {
  profileService: ProfileService;
  projectsService: ProjectsService;
  articlesService: ArticlesService;
  achievementsService: AchievementsService;
};

function createHomePageDeps(): HomePageDeps {
  return {
    profileService: createProfileService(profileRepository),
    projectsService: createProjectsService(projectsRepository),
    articlesService: createArticlesService(articlesRepository),
    achievementsService: createAchievementsService(achievementsRepository),
  };
}

export type HomePageData = {
  profile: Profile;
  featuredSkills: Skill[];
  featuredProjects: Project[];
  featuredArticles: ArticleMeta[];
  featuredAchievements: Achievement[];
};

export async function loadHomePage(
  deps: HomePageDeps = createHomePageDeps(),
): Promise<HomePageData> {
  const [profile, featuredSkills, featuredProjects, featuredArticles, featuredAchievements] =
    await Promise.all([
      deps.profileService.getProfile(),
      deps.profileService.getFeaturedSkills(),
      deps.projectsService.getFeatured(),
      deps.articlesService.getFeatured(),
      deps.achievementsService.getFeatured(),
    ]);
  return { profile, featuredSkills, featuredProjects, featuredArticles, featuredAchievements };
}
