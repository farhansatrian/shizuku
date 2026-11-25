import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
});

export const profileUpdateSchema = z.object({
  brandName: z.string().trim().min(1).max(40),
  brandKanji: z.string().trim().max(12).default("雫"),
  fullName: z.string().trim().min(1).max(120),
  headlineEn: z.string().trim().min(1).max(260),
  headlineId: z.string().trim().min(1).max(260),
  roles: z.object({
    en: z.array(z.string().trim().min(1)).default([]),
    id: z.array(z.string().trim().min(1)).default([]),
  }),
  bioEn: z.string().trim().min(1),
  bioId: z.string().trim().min(1),
  aboutStoryEn: z.string().trim().min(1),
  aboutStoryId: z.string().trim().min(1),
  location: z.string().trim().min(1).max(120),
  currentRoleEn: z.string().trim().min(1).max(160),
  currentRoleId: z.string().trim().min(1).max(160),
  currentOrg: z.string().trim().min(1).max(160),
  availabilityEn: z.string().trim().max(160).default(""),
  availabilityId: z.string().trim().max(160).default(""),
  currentlyEn: z.string().trim().default(""),
  currentlyId: z.string().trim().default(""),
  heroImage: z.string().trim().default(""),
  heroImageMobile: z.string().trim().default(""),
  avatarImage: z.string().trim().default(""),
  email: z.string().trim().email(),
  linkedinUrl: z.string().trim().default(""),
  githubUrl: z.string().trim().default(""),
  instagramUrl: z.string().trim().default(""),
  youtubeUrl: z.string().trim().default(""),
  resumeUrl: z.string().trim().default(""),
  stats: z
    .array(
      z.object({
        value: z.string().trim().min(1),
        labelEn: z.string().trim().min(1),
        labelId: z.string().trim().min(1),
      })
    )
    .default([]),
  pillars: z
    .array(
      z.object({
        code: z.string().trim().min(1),
        titleEn: z.string().trim().min(1),
        titleId: z.string().trim().min(1),
        descEn: z.string().trim().min(1),
        descId: z.string().trim().min(1),
      })
    )
    .default([]),
});

export const projectInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers, and hyphens only"
    ),
  title: z.string().trim().min(2).max(160),
  category: z.string().trim().min(1).max(40),
  year: z.string().trim().min(2).max(20),
  status: z.string().trim().min(1).max(30),
  roleEn: z.string().trim().min(1).max(140),
  roleId: z.string().trim().min(1).max(140),
  summaryEn: z.string().trim().default(""),
  summaryId: z.string().trim().default(""),
  descriptionEn: z.string().trim().default(""),
  descriptionId: z.string().trim().default(""),
  highlights: z
    .array(
      z.object({
        code: z.string().trim().min(1),
        titleEn: z.string().trim().min(1),
        titleId: z.string().trim().min(1),
        detailEn: z.string().trim().min(1),
        detailId: z.string().trim().min(1),
      })
    )
    .default([]),
  impactMetricEn: z.string().trim().default(""),
  impactMetricId: z.string().trim().default(""),
  techStack: z.array(z.string().trim().min(1)).default([]),
  coverImage: z.string().trim().default("/assets/cover-platform.jpg"),
  liveUrl: z.string().trim().default(""),
  repoUrl: z.string().trim().default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const experienceInputSchema = z.object({
  kind: z.enum(["WORK", "EDUCATION", "ORGANIZATION"]).default("WORK"),
  organization: z.string().trim().min(1).max(160),
  roleEn: z.string().trim().min(1).max(160),
  roleId: z.string().trim().min(1).max(160),
  location: z.string().trim().default("Jakarta, ID"),
  periodEn: z.string().trim().min(1).max(80),
  periodId: z.string().trim().min(1).max(80),
  isCurrent: z.boolean().default(false),
  summaryEn: z.string().trim().default(""),
  summaryId: z.string().trim().default(""),
  bullets: z
    .object({
      en: z.array(z.string().trim().min(1)).default([]),
      id: z.array(z.string().trim().min(1)).default([]),
    })
    .default({ en: [], id: [] }),
  tags: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const certificateInputSchema = z.object({
  titleEn: z.string().trim().min(1).max(180),
  titleId: z.string().trim().min(1).max(180),
  issuer: z.string().trim().min(1).max(140),
  category: z.string().trim().min(1).max(60),
  issuedDate: z.string().trim().min(1).max(40),
  credentialId: z.string().trim().default(""),
  credentialUrl: z.string().trim().default(""),
  imageUrl: z.string().trim().default(""),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const skillGroupInputSchema = z.object({
  nameEn: z.string().trim().min(1).max(100),
  nameId: z.string().trim().min(1).max(100),
  items: z.array(z.string().trim().min(1)).default([]),
  sortOrder: z.number().int().default(0),
});

export const workspaceAppInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.enum(["INTERNAL", "APP", "AGENT", "BOOKMARK"]).default("APP"),
  descriptionEn: z.string().trim().min(1).max(200),
  descriptionId: z.string().trim().default(""),
  url: z.string().trim().min(1).max(400),
  icon: z.string().trim().default("sparkles"),
  badge: z.string().trim().max(24).default(""),
  isExternal: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
