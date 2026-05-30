type Props = {
  tags: readonly string[];
  variant?: 'default' | 'accent';
};

export function TagChips({ tags, variant = 'default' }: Props) {
  const className = `chip chip-${variant}`;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span key={tag} className={className}>
          {tag}
        </span>
      ))}
    </div>
  );
}
