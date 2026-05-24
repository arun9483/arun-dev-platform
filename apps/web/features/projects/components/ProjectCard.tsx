import Link from 'next/link';
import type { Project } from '../types';
import { ImpactMetricBadge } from './ImpactMetricBadge';

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  const { slug, title, description, techStack, impact, metadata } = project;

  return (
    <article className="card rounded-xl p-6 space-y-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/projects/${slug}`}>
          <h2 className="text-lg font-semibold hover:underline text-primary">{title}</h2>
        </Link>
        {metadata.featured && <span className="chip chip-accent shrink-0">Featured</span>}
      </div>

      <p className="text-sm leading-relaxed text-secondary">{description}</p>

      {impact.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {impact.map((metric, i) => (
            <ImpactMetricBadge key={i} metric={metric} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {techStack.map((tech) => (
          <span key={tech} className="chip chip-default">
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
