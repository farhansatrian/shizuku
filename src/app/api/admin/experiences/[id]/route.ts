import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { experienceInputSchema } from "@/lib/validators";
import { serializeExperience } from "@/lib/portfolio";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  try {
    const body = await req.json();
    const parsed = experienceInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid experience data" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const data: Record<string, unknown> = {};
    if (d.kind !== undefined) data.kind = d.kind;
    if (d.organization !== undefined) data.organization = d.organization;
    if (d.roleEn !== undefined) data.roleEn = d.roleEn;
    if (d.roleId !== undefined) data.roleId = d.roleId;
    if (d.location !== undefined) data.location = d.location;
    if (d.periodEn !== undefined) data.periodEn = d.periodEn;
    if (d.periodId !== undefined) data.periodId = d.periodId;
    if (d.isCurrent !== undefined) data.isCurrent = d.isCurrent;
    if (d.summaryEn !== undefined) data.summaryEn = d.summaryEn;
    if (d.summaryId !== undefined) data.summaryId = d.summaryId;
    if (d.bullets !== undefined) data.bulletsJson = JSON.stringify(d.bullets);
    if (d.tags !== undefined) data.tagsJson = JSON.stringify(d.tags);
    if (d.published !== undefined) data.published = d.published;
    if (d.sortOrder !== undefined) data.sortOrder = d.sortOrder;

    const updated = await prisma.experience.update({ where: { id }, data });
    revalidatePublicSite();
    return NextResponse.json({
      ok: true,
      experience: serializeExperience(updated),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update experience" },
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
    await prisma.experience.delete({ where: { id } });
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 404 }
    );
  }
}
