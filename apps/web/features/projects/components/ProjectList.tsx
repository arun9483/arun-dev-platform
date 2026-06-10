import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectList.module.css';

type Props = {
  projects: Project[];
  headingLevel?: 'h2' | 'h3';
};

export function ProjectList({ projects, headingLevel = 'h2' }: Props) {
  if (projects.length === 0) {
    return <p className="text-size-sm text-color-secondary">No projects found.</p>;
  }

  return (
    <ul className={styles.list}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
