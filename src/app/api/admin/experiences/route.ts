import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { experienceInputSchema } from "@/lib/validators";
import { serializeExperience } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const rows = await prisma.experience.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ experiences: rows.map(serializeExperience) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = experienceInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid experience data" },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const created = await prisma.experience.create({
      data: {
        kind: d.kind,
        organization: d.organization,
        roleEn: d.roleEn,
        roleId: d.roleId,
        location: d.location,
        periodEn: d.periodEn,
        periodId: d.periodId,
        isCurrent: d.isCurrent,
        summaryEn: d.summaryEn,
        summaryId: d.summaryId,
        bulletsJson: JSON.stringify(d.bullets),
        tagsJson: JSON.stringify(d.tags),
        published: d.published,
        sortOrder: d.sortOrder,
      },
    });

    revalidatePublicSite();
    return NextResponse.json(
      { ok: true, experience: serializeExperience(created) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
