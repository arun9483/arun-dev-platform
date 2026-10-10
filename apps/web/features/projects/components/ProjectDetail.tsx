import { Card, Heading, Link } from '@arun-dev/ui';
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
          <Heading level={1} size="4xl" className="font-weight-bold type-display">
            {title}
          </Heading>
          <p
            className={`text-size-base line-height-relaxed text-color-secondary ${styles.description}`}
          >
            {description}
          </p>
          <div className={styles.links}>
            {links.github && (
              <Link href={links.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗<span className="sr-only"> (opens in new tab)</span>
              </Link>
            )}
            {links.live && (
              <Link href={links.live} target="_blank" rel="noopener noreferrer">
                Live site ↗<span className="sr-only"> (opens in new tab)</span>
              </Link>
            )}
          </div>
        </div>

        {impact.length > 0 && (
          <section className={styles.impactSection}>
            <Heading level={2} size="xs" className={`type-overline ${styles.impactLabel}`}>
              Impact
            </Heading>
            <div className={styles.impactGrid}>
              {impact.map((metric, i) => (
                <ImpactMetricBadge key={i} metric={metric} />
              ))}
            </div>
          </section>
        )}

        <Card className={styles.caseStudy}>
          <div className={styles.caseStudySection}>
            <Heading level={2} size="xs" className="type-overline">
              Problem
            </Heading>
            <p className="text-size-base line-height-relaxed text-color-primary">{problem}</p>
          </div>
          <div className={styles.caseStudySectionDivider}>
            <Heading level={2} size="xs" className="type-overline">
              Solution
            </Heading>
            <p className="text-size-base line-height-relaxed text-color-primary">{solution}</p>
          </div>
        </Card>

        <section className={styles.techSection}>
          <Heading level={2} size="xs" className="type-overline">
            Tech Stack
          </Heading>
          <TagChips tags={techStack} />
        </section>

        {links.references && links.references.length > 0 && (
          <section className={styles.referencesSection}>
            <Heading level={2} size="xs" className="type-overline">
              References
            </Heading>
            <ul role="list" className={styles.referencesList}>
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
