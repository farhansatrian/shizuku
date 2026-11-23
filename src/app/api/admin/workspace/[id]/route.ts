import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { workspaceAppInputSchema } from "@/lib/validators";
import { serializeWorkspaceApp } from "@/lib/portfolio";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const { id } = await context.params;
  try {
    const body = await req.json();
    const parsed = workspaceAppInputSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message || "Invalid workspace app data",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.workspaceApp.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePublicSite();
    return NextResponse.json({
      ok: true,
      workspaceApp: serializeWorkspaceApp(updated),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update workspace app" },
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
    await prisma.workspaceApp.delete({ where: { id } });
    revalidatePublicSite();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete workspace app" },
      { status: 404 }
    );
  }
}
