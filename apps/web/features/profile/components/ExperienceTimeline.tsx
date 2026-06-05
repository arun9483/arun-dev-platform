import type { Experience } from '../types';

type Props = {
  experience: Experience[];
};

function formatDateRange(startDate: string, endDate?: string): string {
  return endDate ? `${startDate} — ${endDate}` : `${startDate} — Present`;
}

export function ExperienceTimeline({ experience }: Props) {
  return (
    <ol className="space-y-8" aria-label="Work experience">
      {experience.map((item, index) => (
        <li key={index} className="relative pl-6 border-l-2 border-color-default">
          <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
          <p className="text-xs mb-1 text-secondary">
            {formatDateRange(item.startDate, item.endDate)}
          </p>
          <h3 className="font-semibold text-base text-primary">{item.role}</h3>
          <p className="text-sm mb-3 text-secondary">{item.company}</p>
          <ul className="space-y-1">
            {item.highlights.map((highlight, i) => (
              <li key={i} className="text-sm flex gap-2 text-secondary">
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
