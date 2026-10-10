import { loadProjectsPage } from './page.loader';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { Heading } from '@arun-dev/ui';

export const metadata = {
  title: 'Projects',
  description: 'Engineering case studies with real-world impact metrics.',
};

export default async function ProjectsPage() {
  const { projects } = await loadProjectsPage();
  return (
    <div className="page-container stack space-xl">
      <div className="stack space-2xs">
        <Heading level={1} size="3xl" className="font-weight-bold type-display">
          Projects
        </Heading>
        <p className="text-size-base text-color-secondary">
          Engineering case studies with measurable impact.
        </p>
      </div>
      <ProjectList projects={projects} />
      <p className="text-size-sm text-color-muted">
        More case studies in progress — check back soon.
      </p>
    </div>
  );
}
