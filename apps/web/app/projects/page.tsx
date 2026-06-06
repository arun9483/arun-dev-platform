import { loadProjectsPage } from './page.loader';
import { ProjectList } from '@/features/projects/components/ProjectList';

export const metadata = {
  title: 'Projects',
  description: 'Engineering case studies with real-world impact metrics.',
};

export default async function ProjectsPage() {
  const { projects } = await loadProjectsPage();
  return (
    <div className="mx-auto max-w-4xl px-6 py-8 sm:py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-display">Projects</h1>
        <p className="text-base text-secondary">Engineering case studies with measurable impact.</p>
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
