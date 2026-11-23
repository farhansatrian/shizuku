import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { projectInputSchema } from "@/lib/validators";
import { serializeProject } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const rows = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ projects: rows.map(serializeProject) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = projectInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid project data" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const existingSlug = await prisma.project.findUnique({
      where: { slug: d.slug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: `A project with slug "${d.slug}" already exists.` },
        { status: 409 }
      );
    }

    const created = await prisma.project.create({
      data: {
        slug: d.slug,
        title: d.title,
        category: d.category,
        year: d.year,
        status: d.status,
        roleEn: d.roleEn,
        roleId: d.roleId,
        summaryEn: d.summaryEn,
        summaryId: d.summaryId,
        descriptionEn: d.descriptionEn,
        descriptionId: d.descriptionId,
        highlightsJson: JSON.stringify(d.highlights),
        impactMetricEn: d.impactMetricEn,
        impactMetricId: d.impactMetricId,
        techStackJson: JSON.stringify(d.techStack),
        coverImage: d.coverImage || "/assets/cover-platform.jpg",
        liveUrl: d.liveUrl,
        repoUrl: d.repoUrl,
        featured: d.featured,
        published: d.published,
        sortOrder: d.sortOrder,
      },
    });

    revalidatePublicSite();
    return NextResponse.json(
      { ok: true, project: serializeProject(created) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
