import { ProjectList } from './ProjectList';
import type { Project } from '../types';

type Props = {
  projects: Promise<Project[]>;
};

// Awaits its data inside a Suspense boundary so the page shell (and its LCP
// element) streams to the browser before this below-the-fold section.
export async function FeaturedProjects({ projects }: Props) {
  return <ProjectList projects={await projects} headingLevel="h3" />;
}
