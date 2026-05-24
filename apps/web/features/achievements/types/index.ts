type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type AchievementType = 'certification' | 'award' | 'recognition' | 'contribution';

export type AchievementMetadata = {
  tags: string[];
  featured?: boolean;
};

export type Achievement = BaseEntity & {
  title: string;
  issuer: string;
  date: string;
  type: AchievementType;
  description?: string;
  credentialUrl?: string;
  metadata: AchievementMetadata;
};
