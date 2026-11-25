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
    "Software Engineer, ODP IT at Bank Negara Indonesia (BNI), and creator of the shizuku web ecosystem.",
  headlineId:
    "Software Engineer, ODP IT di Bank Negara Indonesia (BNI), dan pembuat ekosistem web shizuku.",
  roles: {
    en: ["Software Engineer", "ODP IT · BNI"],
    id: ["Software Engineer", "ODP IT · BNI"],
  },
  bioEn:
    "Software engineer with a background in Informatics and Application Software Engineering, focused on backend and full-stack development.",
  bioId:
    "Software engineer dengan latar belakang Informatika dan Rekayasa Perangkat Lunak Aplikasi yang berfokus pada pengembangan backend dan full-stack.",
  aboutStoryEn:
    "shizuku (雫) is a personal web hub and digital ecosystem.\n\nBuilt around calm minimalism, shizuku brings together personal works, portfolio records, and a shared SHIZUKU ID across companion web apps like SHIKAS and SHIKOST.",
  aboutStoryId:
    "shizuku (雫) adalah ruang web personal dan ekosistem digital.\n\nDibangun dengan gaya minimalis yang tenang, shizuku menyatukan karya ekosistem, catatan portofolio, dan satu SHIZUKU ID untuk aplikasi seperti SHIKAS dan SHIKOST.",
  location: "Jakarta, Indonesia",
  currentRoleEn: "Officer Development Program (ODP) — IT",
  currentRoleId: "Officer Development Program (ODP) — IT",
  currentOrg: "PT Bank Negara Indonesia (Persero) Tbk (BNI)",
  availabilityEn: "",
  availabilityId: "",
  currentlyEn: "",
  currentlyId: "",
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
