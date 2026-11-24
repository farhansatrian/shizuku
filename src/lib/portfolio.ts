import "server-only";
import { prisma } from "./db";
import type {
  BilingualBullets,
  BilingualRoles,
  PortfolioPayload,
  ProfilePillar,
  ProfileStat,
  ProjectHighlight,
  SerializedCertificate,
  SerializedExperience,
  SerializedProfile,
  SerializedProject,
  SerializedSkillGroup,
  SerializedWorkspaceApp,
} from "./types";
import type {
  Certificate,
  Experience,
  Project,
  SiteProfile,
  SkillGroup,
  WorkspaceApp,
} from "@prisma/client";

function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function serializeProfile(row: SiteProfile): SerializedProfile {
  return {
    id: row.id,
    brandName: row.brandName,
    brandKanji: row.brandKanji,
    fullName: row.fullName,
    headlineEn: row.headlineEn,
    headlineId: row.headlineId,
    roles: safeParseJson<BilingualRoles>(row.rolesJson, { en: [], id: [] }),
    bioEn: row.bioEn,
    bioId: row.bioId,
    aboutStoryEn: row.aboutStoryEn,
    aboutStoryId: row.aboutStoryId,
    location: row.location,
    currentRoleEn: row.currentRoleEn,
    currentRoleId: row.currentRoleId,
    currentOrg: row.currentOrg,
    availabilityEn: row.availabilityEn,
    availabilityId: row.availabilityId,
    currentlyEn: row.currentlyEn,
    currentlyId: row.currentlyId,
    heroImage: row.heroImage,
    heroImageMobile: row.heroImageMobile,
    avatarImage: row.avatarImage,
    email: row.email,
    linkedinUrl: row.linkedinUrl,
    githubUrl: row.githubUrl,
    instagramUrl: row.instagramUrl,
    youtubeUrl: row.youtubeUrl,
    resumeUrl: row.resumeUrl,
    stats: safeParseJson<ProfileStat[]>(row.statsJson, []),
    pillars: safeParseJson<ProfilePillar[]>(row.pillarsJson, []),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function serializeWorkspaceApp(
  row: WorkspaceApp
): SerializedWorkspaceApp {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    descriptionEn: row.descriptionEn,
    descriptionId: row.descriptionId,
    url: row.url,
    icon: row.icon,
    badge: row.badge,
    isExternal: row.isExternal,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function serializeProject(row: Project): SerializedProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    year: row.year,
    status: row.status,
    roleEn: row.roleEn,
    roleId: row.roleId,
    summaryEn: row.summaryEn,
    summaryId: row.summaryId,
    descriptionEn: row.descriptionEn,
    descriptionId: row.descriptionId,
    highlights: safeParseJson<ProjectHighlight[]>(row.highlightsJson, []),
    impactMetricEn: row.impactMetricEn,
    impactMetricId: row.impactMetricId,
    techStack: safeParseJson<string[]>(row.techStackJson, []),
    coverImage: row.coverImage,
    liveUrl: row.liveUrl,
    repoUrl: row.repoUrl,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function serializeExperience(row: Experience): SerializedExperience {
  return {
    id: row.id,
    kind: row.kind,
    organization: row.organization,
    roleEn: row.roleEn,
    roleId: row.roleId,
    location: row.location,
    periodEn: row.periodEn,
    periodId: row.periodId,
    isCurrent: row.isCurrent,
    summaryEn: row.summaryEn,
    summaryId: row.summaryId,
    bullets: safeParseJson<BilingualBullets>(row.bulletsJson, {
      en: [],
      id: [],
    }),
    tags: safeParseJson<string[]>(row.tagsJson, []),
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function serializeCertificate(row: Certificate): SerializedCertificate {
  return {
    id: row.id,
    titleEn: row.titleEn,
    titleId: row.titleId,
    issuer: row.issuer,
    category: row.category,
    issuedDate: row.issuedDate,
    credentialId: row.credentialId,
    credentialUrl: row.credentialUrl,
    imageUrl: row.imageUrl,
    featured: row.featured,
    published: row.published,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function serializeSkillGroup(row: SkillGroup): SerializedSkillGroup {
  return {
    id: row.id,
    nameEn: row.nameEn,
    nameId: row.nameId,
    items: safeParseJson<string[]>(row.itemsJson, []),
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const FALLBACK_PROFILE: SerializedProfile = {
  id: "main",
  brandName: "shizuku",
  brandKanji: "雫",
  fullName: "Farhan Satria Nugraha",
  headlineEn:
    "Quiet engineering for banking systems, applied AI, and calm web software.",
  headlineId:
    "Rekayasa tenang untuk sistem perbankan, AI terapan, dan perangkat lunak web yang berkesan.",
  roles: {
    en: ["Software Engineer", "ODP IT · Banking Systems", "AI Enthusiast"],
    id: ["Software Engineer", "ODP IT · Sistem Perbankan", "Penggiat AI"],
  },
  bioEn:
    "Software Engineer at Bank Negara Indonesia (ODP IT), exploring resilient systems, business impact, and applied AI.",
  bioId:
    "Software Engineer di Bank Negara Indonesia (ODP IT), mendalami sistem andal, dampak bisnis, dan AI terapan.",
  aboutStoryEn: "Welcome to shizuku — my personal digital hub.",
  aboutStoryId: "Selamat datang di shizuku — ruang digital pribadi saya.",
  location: "Jakarta, Indonesia",
  currentRoleEn: "Officer Development Program (ODP) — IT",
  currentRoleId: "Officer Development Program (ODP) — IT",
  currentOrg: "PT Bank Negara Indonesia (Persero) Tbk",
  availabilityEn: "Personal Digital Hub",
  availabilityId: "Ruang Digital Pribadi",
  currentlyEn: "Exploring enterprise banking architecture and applied AI.",
  currentlyId: "Mendalami arsitektur perbankan dan AI terapan.",
  heroImage: "",
  heroImageMobile: "",
  avatarImage: "",
  email: "farhansatria.07@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/farhansatrian/",
  githubUrl: "https://github.com/farhansatrian",
  instagramUrl: "https://www.instagram.com/farhansatria_n/",
  youtubeUrl: "https://www.youtube.com/@ahansn",
  resumeUrl: "",
  stats: [],
  pillars: [],
  updatedAt: new Date().toISOString(),
};

export async function getPublicPortfolio(): Promise<PortfolioPayload> {
  const [
    profileRow,
    workspaceApps,
    projects,
    experiences,
    certificates,
    skillGroups,
  ] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: "main" } }),
    prisma.workspaceApp.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.experience.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.certificate.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.skillGroup.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return {
    profile: profileRow ? serializeProfile(profileRow) : FALLBACK_PROFILE,
    workspaceApps: workspaceApps.map(serializeWorkspaceApp),
    projects: projects.map(serializeProject),
    experiences: experiences.map(serializeExperience),
    certificates: certificates.map(serializeCertificate),
    skillGroups: skillGroups.map(serializeSkillGroup),
  };
}

export async function getAdminPortfolio(): Promise<PortfolioPayload> {
  const [
    profileRow,
    workspaceApps,
    projects,
    experiences,
    certificates,
    skillGroups,
  ] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: "main" } }),
    prisma.workspaceApp.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.experience.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.certificate.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.skillGroup.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return {
    profile: profileRow ? serializeProfile(profileRow) : FALLBACK_PROFILE,
    workspaceApps: workspaceApps.map(serializeWorkspaceApp),
    projects: projects.map(serializeProject),
    experiences: experiences.map(serializeExperience),
    certificates: certificates.map(serializeCertificate),
    skillGroups: skillGroups.map(serializeSkillGroup),
  };
}

export async function getPublicProjectBySlug(slug: string): Promise<{
  profile: SerializedProfile;
  project: SerializedProject | null;
  related: SerializedProject[];
}> {
  const [profileRow, project, others] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: "main" } }),
    prisma.project.findFirst({ where: { slug, published: true } }),
    prisma.project.findMany({
      where: { published: true, NOT: { slug } },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      take: 3,
    }),
  ]);

  return {
    profile: profileRow ? serializeProfile(profileRow) : FALLBACK_PROFILE,
    project: project ? serializeProject(project) : null,
    related: others.map(serializeProject),
  };
}
