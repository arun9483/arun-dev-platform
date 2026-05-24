import type { ImpactMetric } from '../types';

type Props = {
  metric: ImpactMetric;
};

export function ImpactMetricBadge({ metric }: Props) {
  return (
    <div className="metric">
      <p className="text-xs uppercase tracking-wider font-medium text-accent">{metric.label}</p>
      <p className="text-sm font-bold mt-1 text-primary">{metric.value}</p>
    </div>
  );
}
