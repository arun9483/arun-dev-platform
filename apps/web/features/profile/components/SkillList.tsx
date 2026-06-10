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
          <li key={skill.name} className="chip chip-accent">
            {skill.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
