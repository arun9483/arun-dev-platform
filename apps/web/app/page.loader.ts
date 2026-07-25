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
import type { Experience, Profile, Skill } from '@/features/profile/types';
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
  // Above the fold — awaited, so it renders in the streamed shell alongside
  // the LCP element.
  profile: Profile;
  featuredSkills: Skill[];
  featuredExperience: Experience[];
  // Below the fold — handed to Suspense boundaries as unresolved promises so
  // their markup streams after the shell instead of delaying first paint.
  featuredProjects: Promise<Project[]>;
  featuredArticles: Promise<ArticleMeta[]>;
  featuredAchievements: Promise<Achievement[]>;
};

export async function loadHomePage(
  deps: HomePageDeps = createHomePageDeps(),
): Promise<HomePageData> {
  const featuredProjects = deps.projectsService.getFeatured();
  const featuredArticles = deps.articlesService.getFeatured();
  const featuredAchievements = deps.achievementsService.getFeatured();

  const [profile, featuredSkills, featuredExperience] = await Promise.all([
    deps.profileService.getProfile(),
    deps.profileService.getFeaturedSkills(),
    deps.profileService.getFeaturedExperience(),
  ]);

  return {
    profile,
    featuredSkills,
    featuredExperience,
    featuredProjects,
    featuredArticles,
    featuredAchievements,
  };
}
