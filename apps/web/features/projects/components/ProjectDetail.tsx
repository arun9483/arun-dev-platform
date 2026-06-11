import type { Project } from '../types';
import { ImpactMetricBadge } from './ImpactMetricBadge';
import { BackLink } from '@/components/BackLink';
import { Cover } from '@/components/Cover';
import { TagChips } from '@/components/TagChips';
import styles from './ProjectDetail.module.css';

type Props = {
  project: Project;
};

export function ProjectDetail({ project }: Props) {
  const { title, description, problem, solution, techStack, impact, links, coverImage } = project;

  return (
    <div>
      {coverImage && (
        <Cover src={coverImage} alt={`Cover image for ${title}`}>
          <BackLink href="/projects">Back to projects</BackLink>
        </Cover>
      )}

      <div className={styles.container}>
        {!coverImage && <BackLink href="/projects">Back to projects</BackLink>}

        <div className={styles.header}>
          <div className="bar-accent" />
          <h1 className="text-size-4xl font-weight-bold type-display">{title}</h1>
          <p
            className={`text-size-base line-height-relaxed text-color-secondary ${styles.description}`}
          >
            {description}
          </p>
          <div className={styles.links}>
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                GitHub ↗<span className="sr-only"> (opens in new tab)</span>
              </a>
            )}
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Live site ↗<span className="sr-only"> (opens in new tab)</span>
              </a>
            )}
          </div>
        </div>

        {impact.length > 0 && (
          <section className={styles.impactSection}>
            <h2 className={`type-overline ${styles.impactLabel}`}>Impact</h2>
            <div className={styles.impactGrid}>
              {impact.map((metric, i) => (
                <ImpactMetricBadge key={i} metric={metric} />
              ))}
            </div>
          </section>
        )}

        <div className={`card ${styles.caseStudy}`}>
          <div className={styles.caseStudySection}>
            <h2 className="type-overline">Problem</h2>
            <p className="text-size-base line-height-relaxed text-color-primary">{problem}</p>
          </div>
          <div className={styles.caseStudySectionDivider}>
            <h2 className="type-overline">Solution</h2>
            <p className="text-size-base line-height-relaxed text-color-primary">{solution}</p>
          </div>
        </div>

        <section className={styles.techSection}>
          <h2 className="type-overline">Tech Stack</h2>
          <TagChips tags={techStack} />
        </section>

        {links.references && links.references.length > 0 && (
          <section className={styles.referencesSection}>
            <h2 className="type-overline">References</h2>
            <ul className={styles.referencesList}>
              {links.references.map((reference) => (
                <li key={reference.url}>
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-size-sm ${styles.referenceLink}`}
                  >
                    {reference.label} ↗<span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
