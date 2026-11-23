import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { profileUpdateSchema } from "@/lib/validators";
import { serializeProfile } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const row = await prisma.siteProfile.findUnique({ where: { id: "main" } });
  if (!row) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  return NextResponse.json({ profile: serializeProfile(row) });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid profile payload" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const updated = await prisma.siteProfile.upsert({
      where: { id: "main" },
      create: {
        id: "main",
        brandName: d.brandName,
        brandKanji: d.brandKanji,
        fullName: d.fullName,
        headlineEn: d.headlineEn,
        headlineId: d.headlineId,
        rolesJson: JSON.stringify(d.roles),
        bioEn: d.bioEn,
        bioId: d.bioId,
        aboutStoryEn: d.aboutStoryEn,
        aboutStoryId: d.aboutStoryId,
        location: d.location,
        currentRoleEn: d.currentRoleEn,
        currentRoleId: d.currentRoleId,
        currentOrg: d.currentOrg,
        availabilityEn: d.availabilityEn,
        availabilityId: d.availabilityId,
        currentlyEn: d.currentlyEn,
        currentlyId: d.currentlyId,
        heroImage: d.heroImage,
        heroImageMobile: d.heroImageMobile,
        avatarImage: d.avatarImage,
        email: d.email,
        linkedinUrl: d.linkedinUrl,
        githubUrl: d.githubUrl,
        instagramUrl: d.instagramUrl,
        resumeUrl: d.resumeUrl,
        statsJson: JSON.stringify(d.stats),
        pillarsJson: JSON.stringify(d.pillars),
      },
      update: {
        brandName: d.brandName,
        brandKanji: d.brandKanji,
        fullName: d.fullName,
        headlineEn: d.headlineEn,
        headlineId: d.headlineId,
        rolesJson: JSON.stringify(d.roles),
        bioEn: d.bioEn,
        bioId: d.bioId,
        aboutStoryEn: d.aboutStoryEn,
        aboutStoryId: d.aboutStoryId,
        location: d.location,
        currentRoleEn: d.currentRoleEn,
        currentRoleId: d.currentRoleId,
        currentOrg: d.currentOrg,
        availabilityEn: d.availabilityEn,
        availabilityId: d.availabilityId,
        currentlyEn: d.currentlyEn,
        currentlyId: d.currentlyId,
        heroImage: d.heroImage,
        heroImageMobile: d.heroImageMobile,
        avatarImage: d.avatarImage,
        email: d.email,
        linkedinUrl: d.linkedinUrl,
        githubUrl: d.githubUrl,
        instagramUrl: d.instagramUrl,
        resumeUrl: d.resumeUrl,
        statsJson: JSON.stringify(d.stats),
        pillarsJson: JSON.stringify(d.pillars),
      },
    });

    revalidatePublicSite();
    return NextResponse.json({ ok: true, profile: serializeProfile(updated) });
  } catch {
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
