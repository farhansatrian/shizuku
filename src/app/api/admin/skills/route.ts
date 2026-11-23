import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { skillGroupInputSchema } from "@/lib/validators";
import { serializeSkillGroup } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const rows = await prisma.skillGroup.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ skillGroups: rows.map(serializeSkillGroup) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = skillGroupInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid skill group" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const created = await prisma.skillGroup.create({
      data: {
        nameEn: d.nameEn,
        nameId: d.nameId,
        itemsJson: JSON.stringify(d.items),
        sortOrder: d.sortOrder,
      },
    });

    revalidatePublicSite();
    return NextResponse.json(
      { ok: true, skillGroup: serializeSkillGroup(created) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create skill group" },
      { status: 500 }
    );
  }
}
