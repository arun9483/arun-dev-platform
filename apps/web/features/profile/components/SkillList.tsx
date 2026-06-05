import type { Skill } from '../types';

type Props = {
  skills: Skill[];
  title?: string;
};

export function SkillList({ skills, title }: Props) {
  return (
    <section>
      {title && <p className="overline mb-3">{title}</p>}
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill.name} className="chip chip-accent">
            {skill.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
