import Link from 'next/link';
import { Card, Chip } from '@arun-dev/ui';
import type { Project } from '../types';
import { ImpactMetricBadge } from './ImpactMetricBadge';
import styles from './ProjectCard.module.css';

type Props = {
  project: Project;
  headingLevel?: 'h2' | 'h3';
};

export function ProjectCard({ project, headingLevel = 'h2' }: Props) {
  const { slug, title, description, techStack, impact, metadata } = project;
  const Heading = headingLevel;

  return (
    <Card as="article" lift className={styles.article}>
      <div className={styles.titleRow}>
        <Heading
          className={`text-size-lg font-weight-semibold text-color-primary ${styles.heading}`}
        >
          {title}
        </Heading>
        {metadata.featured && <Chip variant="accent">Featured</Chip>}
      </div>

      <p className="text-size-sm line-height-relaxed text-color-secondary">{description}</p>

      {impact.length > 0 && (
        <div className={styles.impactGrid}>
          {impact.map((metric, i) => (
            <ImpactMetricBadge key={i} metric={metric} />
          ))}
        </div>
      )}

      <div className={styles.tags}>
        {techStack.map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>

      <Link href={`/projects/${slug}`} aria-label={title} className={styles.overlay} />
    </Card>
  );
}
