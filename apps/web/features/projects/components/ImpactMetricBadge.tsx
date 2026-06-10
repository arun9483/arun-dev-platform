import type { ImpactMetric } from '../types';
import styles from './ImpactMetricBadge.module.css';

type Props = {
  metric: ImpactMetric;
};

export function ImpactMetricBadge({ metric }: Props) {
  return (
    <dl className="metric">
      <dt className={`text-size-xs font-weight-medium text-color-accent ${styles.label}`}>
        {metric.label}
      </dt>
      <dd className={`text-size-sm font-weight-bold text-color-primary ${styles.value}`}>
        {metric.value}
      </dd>
    </dl>
  );
}
