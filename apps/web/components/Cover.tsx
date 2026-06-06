import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
};

function GradientHero() {
  return (
    <div
      className="w-full h-48 sm:h-56 relative overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          'linear-gradient(135deg, var(--color-text-accent) 0%, color-mix(in oklch, var(--color-text-accent) 55%, black) 100%)',
      }}
    >
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/[0.03]" />
    </div>
  );
}

export function Cover({ src, alt }: Props) {
  if (src.includes('placeholder')) {
    return <GradientHero />;
  }

  return (
    <div className="cover">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={480}
        className="w-full object-cover"
        priority
      />
    </div>
  );
}
