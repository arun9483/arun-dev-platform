import { Chip } from '@arun-dev/ui';
import type { Skill } from '../types';
import styles from './SkillList.module.css';

type Props = {
  skills: Skill[];
  title?: string;
};

export function SkillList({ skills, title }: Props) {
  return (
    <section className={styles.section}>
      {title && <p className={`type-overline ${styles.label}`}>{title}</p>}
      <ul className={styles.chips}>
        {skills.map((skill) => (
          <Chip key={skill.name} render={<li />} variant="accent">
            {skill.name}
          </Chip>
        ))}
      </ul>
    </section>
  );
}
