import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
};

export function Cover({ src, alt }: Props) {
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
