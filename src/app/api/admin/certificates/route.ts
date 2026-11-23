import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, revalidatePublicSite } from "@/lib/api-auth";
import { certificateInputSchema } from "@/lib/validators";
import { serializeCertificate } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  const rows = await prisma.certificate.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ certificates: rows.map(serializeCertificate) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = certificateInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message || "Invalid certificate data",
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const created = await prisma.certificate.create({
      data: {
        titleEn: d.titleEn,
        titleId: d.titleId,
        issuer: d.issuer,
        category: d.category,
        issuedDate: d.issuedDate,
        credentialId: d.credentialId,
        credentialUrl: d.credentialUrl,
        imageUrl: d.imageUrl,
        featured: d.featured,
        published: d.published,
        sortOrder: d.sortOrder,
      },
    });

    revalidatePublicSite();
    return NextResponse.json(
      { ok: true, certificate: serializeCertificate(created) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
