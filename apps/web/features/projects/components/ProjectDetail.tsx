import type { Project } from '../types';
import { ImpactMetricBadge } from './ImpactMetricBadge';
import { BackLink } from '@/components/BackLink';
import { Cover } from '@/components/Cover';
import { TagChips } from '@/components/TagChips';

type Props = {
  project: Project;
};

export function ProjectDetail({ project }: Props) {
  const { title, description, problem, solution, techStack, impact, links, coverImage } = project;

  return (
    <div>
      {coverImage && <Cover src={coverImage} alt={`Cover image for ${title}`} />}

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-12">
        <BackLink href="/projects">Back to projects</BackLink>

        <div className="space-y-5">
          <div className="bar-accent" />
          <h1 className="text-4xl font-bold text-display">{title}</h1>
          <p className="text-base leading-relaxed max-w-2xl text-secondary">{description}</p>
          <div className="flex gap-2 flex-wrap">
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost hover:opacity-75"
              >
                GitHub ↗
              </a>
            )}
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary hover:opacity-75"
              >
                Live site ↗
              </a>
            )}
          </div>
        </div>

        {impact.length > 0 && (
          <section className="space-y-4">
            <h2 className="overline">Impact</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {impact.map((metric, i) => (
                <ImpactMetricBadge key={i} metric={metric} />
              ))}
            </div>
          </section>
        )}

        <div className="card rounded-xl p-8 space-y-8">
          <div className="space-y-3">
            <h2 className="overline">Problem</h2>
            <p className="text-base leading-relaxed text-primary">{problem}</p>
          </div>
          <div className="space-y-3 border-top-default pt-8">
            <h2 className="overline">Solution</h2>
            <p className="text-base leading-relaxed text-primary">{solution}</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="overline">Tech Stack</h2>
          <TagChips tags={techStack} />
        </section>
      </div>
    </div>
  );
}
