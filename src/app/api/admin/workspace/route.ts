import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { workspaceAppInputSchema } from "@/lib/validators";
import { serializeWorkspaceApp } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const rows = await prisma.workspaceApp.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({
    workspaceApps: rows.map(serializeWorkspaceApp),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = workspaceAppInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message || "Invalid workspace app data",
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const created = await prisma.workspaceApp.create({
      data: {
        name: d.name,
        category: d.category,
        descriptionEn: d.descriptionEn,
        descriptionId: d.descriptionId || d.descriptionEn,
        url: d.url,
        icon: d.icon,
        badge: d.badge,
        isExternal: d.isExternal,
        published: d.published,
        sortOrder: d.sortOrder,
      },
    });

    revalidatePublicSite();
    return NextResponse.json(
      { ok: true, workspaceApp: serializeWorkspaceApp(created) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create workspace app" },
      { status: 500 }
    );
  }
}
