import type { ImpactMetric } from '../types';

type Props = {
  metric: ImpactMetric;
};

export function ImpactMetricBadge({ metric }: Props) {
  return (
    <dl className="metric">
      <dt className="text-xs uppercase tracking-wider font-medium text-accent">{metric.label}</dt>
      <dd className="text-sm font-bold mt-1 text-primary">{metric.value}</dd>
    </dl>
  );
}
