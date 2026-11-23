import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { projectInputSchema } from "@/lib/validators";
import { serializeProject } from "@/lib/portfolio";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  try {
    const body = await req.json();
    const parsed = projectInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid update data" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const data: Record<string, unknown> = {};
    if (d.slug !== undefined) data.slug = d.slug;
    if (d.title !== undefined) data.title = d.title;
    if (d.category !== undefined) data.category = d.category;
    if (d.year !== undefined) data.year = d.year;
    if (d.status !== undefined) data.status = d.status;
    if (d.roleEn !== undefined) data.roleEn = d.roleEn;
    if (d.roleId !== undefined) data.roleId = d.roleId;
    if (d.summaryEn !== undefined) data.summaryEn = d.summaryEn;
    if (d.summaryId !== undefined) data.summaryId = d.summaryId;
    if (d.descriptionEn !== undefined) data.descriptionEn = d.descriptionEn;
    if (d.descriptionId !== undefined) data.descriptionId = d.descriptionId;
    if (d.highlights !== undefined)
      data.highlightsJson = JSON.stringify(d.highlights);
    if (d.impactMetricEn !== undefined) data.impactMetricEn = d.impactMetricEn;
    if (d.impactMetricId !== undefined) data.impactMetricId = d.impactMetricId;
    if (d.techStack !== undefined)
      data.techStackJson = JSON.stringify(d.techStack);
    if (d.coverImage !== undefined) data.coverImage = d.coverImage;
    if (d.liveUrl !== undefined) data.liveUrl = d.liveUrl;
    if (d.repoUrl !== undefined) data.repoUrl = d.repoUrl;
    if (d.featured !== undefined) data.featured = d.featured;
    if (d.published !== undefined) data.published = d.published;
    if (d.sortOrder !== undefined) data.sortOrder = d.sortOrder;

    const updated = await prisma.project.update({ where: { id }, data });
    revalidatePublicSite();
    revalidatePath(`/projects/${updated.slug}`);
    return NextResponse.json({ ok: true, project: serializeProject(updated) });
  } catch {
    return NextResponse.json(
      { error: "Failed to update project (check slug uniqueness or ID)" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 404 }
    );
  }
}
