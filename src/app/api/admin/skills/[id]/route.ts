import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { skillGroupInputSchema } from "@/lib/validators";
import { serializeSkillGroup } from "@/lib/portfolio";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  try {
    const body = await req.json();
    const parsed = skillGroupInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid skill group" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const data: Record<string, unknown> = {};
    if (d.nameEn !== undefined) data.nameEn = d.nameEn;
    if (d.nameId !== undefined) data.nameId = d.nameId;
    if (d.items !== undefined) data.itemsJson = JSON.stringify(d.items);
    if (d.sortOrder !== undefined) data.sortOrder = d.sortOrder;

    const updated = await prisma.skillGroup.update({ where: { id }, data });
    revalidatePublicSite();
    return NextResponse.json({
      ok: true,
      skillGroup: serializeSkillGroup(updated),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update skill group" },
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
    await prisma.skillGroup.delete({ where: { id } });
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete skill group" },
      { status: 404 }
    );
  }
}
