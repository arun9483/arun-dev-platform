import { Chip } from '@arun-dev/ui';
import styles from './TagChips.module.css';

type Props = {
  tags: readonly string[];
  variant?: 'default' | 'accent';
};

export function TagChips({ tags, variant = 'default' }: Props) {
  return (
    <div className={styles.list}>
      {tags.map((tag) => (
        <Chip key={tag} variant={variant}>
          {tag}
        </Chip>
      ))}
    </div>
  );
}
