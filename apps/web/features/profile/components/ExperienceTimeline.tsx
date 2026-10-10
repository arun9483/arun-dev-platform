import type { Experience } from '../types';
import styles from './ExperienceTimeline.module.css';
import { Heading } from '@arun-dev/ui';

type Props = {
  experience: Experience[];
};

function formatDateRange(startDate: string, endDate?: string): string {
  return endDate ? `${startDate} — ${endDate}` : `${startDate} — Present`;
}

export function ExperienceTimeline({ experience }: Props) {
  return (
    <ol role="list" className={styles.list} aria-label="Work experience">
      {experience.map((item, index) => (
        <li key={index} className={styles.item}>
          <div className={styles.dot} />
          <p className={`text-size-xs text-color-secondary ${styles.date}`}>
            {formatDateRange(item.startDate, item.endDate)}
          </p>
          <Heading level={3} size="base" className="font-weight-semibold text-color-primary">
            {item.role}
          </Heading>
          <p className={`text-size-sm text-color-secondary ${styles.company}`}>{item.company}</p>
          <ul role="list" className={styles.highlights}>
            {item.highlights.map((highlight, i) => (
              <li key={i} className={`text-size-sm text-color-secondary ${styles.highlight}`}>
                <span aria-hidden>—</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
