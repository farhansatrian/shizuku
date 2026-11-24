export type Locale = "en" | "id";

export interface BilingualRoles {
  en: string[];
  id: string[];
}

export interface ProfileStat {
  value: string;
  labelEn: string;
  labelId: string;
}

export interface ProfilePillar {
  code: string;
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
}

export interface ProjectHighlight {
  code: string;
  titleEn: string;
  titleId: string;
  detailEn: string;
  detailId: string;
}

export interface BilingualBullets {
  en: string[];
  id: string[];
}

export interface SerializedProfile {
  id: string;
  brandName: string;
  brandKanji: string;
  fullName: string;
  headlineEn: string;
  headlineId: string;
  roles: BilingualRoles;
  bioEn: string;
  bioId: string;
  aboutStoryEn: string;
  aboutStoryId: string;
  location: string;
  currentRoleEn: string;
  currentRoleId: string;
  currentOrg: string;
  availabilityEn: string;
  availabilityId: string;
  currentlyEn: string;
  currentlyId: string;
  heroImage: string;
  heroImageMobile: string;
  avatarImage: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  resumeUrl: string;
  stats: ProfileStat[];
  pillars: ProfilePillar[];
  updatedAt: string;
}

export interface SerializedProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  status: string;
  roleEn: string;
  roleId: string;
  summaryEn: string;
  summaryId: string;
  descriptionEn: string;
  descriptionId: string;
  highlights: ProjectHighlight[];
  impactMetricEn: string;
  impactMetricId: string;
  techStack: string[];
  coverImage: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedExperience {
  id: string;
  kind: string;
  organization: string;
  roleEn: string;
  roleId: string;
  location: string;
  periodEn: string;
  periodId: string;
  isCurrent: boolean;
  summaryEn: string;
  summaryId: string;
  bullets: BilingualBullets;
  tags: string[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedCertificate {
  id: string;
  titleEn: string;
  titleId: string;
  issuer: string;
  category: string;
  issuedDate: string;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedSkillGroup {
  id: string;
  nameEn: string;
  nameId: string;
  items: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedWorkspaceApp {
  id: string;
  name: string;
  category: string;
  descriptionEn: string;
  descriptionId: string;
  url: string;
  icon: string;
  badge: string;
  isExternal: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioPayload {
  profile: SerializedProfile;
  workspaceApps: SerializedWorkspaceApp[];
  projects: SerializedProject[];
  experiences: SerializedExperience[];
  certificates: SerializedCertificate[];
  skillGroups: SerializedSkillGroup[];
}
