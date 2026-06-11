type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ImpactMetric = {
  label: string;
  value: string;
};

export type NamedLink = {
  label: string;
  url: string;
};

export type ProjectLinks = {
  github?: string;
  live?: string;
  references?: NamedLink[];
};

export type ProjectMetadata = {
  tags: string[];
  featured?: boolean;
};

export type Project = BaseEntity & {
  slug: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  techStack: string[];
  impact: ImpactMetric[];
  links: ProjectLinks;
  coverImage?: string;
  metadata: ProjectMetadata;
};
