type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type SkillCategory = 'frontend' | 'backend' | 'tools' | 'other';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type Skill = {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
};

export type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
  techStack: string[];
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export type Profile = BaseEntity & {
  name: string;
  title: string;
  summary: string;
  location?: string;
  skills: Skill[];
  experience: Experience[];
  socialLinks: SocialLinks;
};
