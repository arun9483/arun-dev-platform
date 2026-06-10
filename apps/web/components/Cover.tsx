import Image from 'next/image';
import styles from './Cover.module.css';

type Props = {
  src: string;
  alt: string;
  children?: React.ReactNode;
};

export function Cover({ src, alt, children }: Props) {
  const isPlaceholder = src.includes('placeholder');

  return (
    <div className={styles.wrapper}>
      {isPlaceholder ? (
        <div className={`${styles.gradientHero} ${styles.gradientPlaceholder}`} aria-hidden="true">
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>
      ) : (
        <Image src={src} alt={alt} width={1200} height={480} className={styles.image} priority />
      )}
      {children && <div className={styles.overlay}>{children}</div>}
    </div>
  );
}
