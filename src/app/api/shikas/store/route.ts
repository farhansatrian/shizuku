import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  ecosystemPreflight,
  getEcosystemUserFromRequest,
  withEcosystemCors,
} from "@/lib/ecosystem-auth";

const txSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(["income", "expense"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amountIdr: z.number().int().positive(),
  categoryId: z.string().min(1).max(60),
  note: z.string().max(240),
  merchant: z.string().max(120).optional(),
  createdAt: z.string().min(1).max(64),
});

const storeSchema = z.object({
  version: z.number().int().optional(),
  transactions: z.array(txSchema).max(5000),
  settings: z
    .object({
      locale: z.enum(["en", "id"]).default("en"),
      privacyMode: z.boolean().default(false),
      rainEnabled: z.boolean().default(true),
      shizukuWebsiteUrl: z.string().optional(),
    })
    .optional(),
});

export function OPTIONS(req: NextRequest) {
  return ecosystemPreflight(req);
}

export async function GET(req: NextRequest) {
  const user = await getEcosystemUserFromRequest(req);
  if (!user) {
    return withEcosystemCors(
      req,
      NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    );
  }

  try {
    const [rows, settings] = await Promise.all([
      prisma.shikasTransaction.findMany({
        where: { userId: user.id },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      }),
      prisma.shikasSettings.findUnique({
        where: { userId: user.id },
      }),
    ]);

    return withEcosystemCors(
      req,
      NextResponse.json({
        version: 4,
        transactions: rows.map((r) => ({
          id: r.id,
          type: r.type === "income" ? "income" : "expense",
          date: r.date,
          amountIdr: r.amountIdr,
          categoryId: r.categoryId,
          note: r.note,
          merchant: r.merchant ?? undefined,
          createdAt: r.createdAt,
        })),
        settings: {
          locale: settings?.locale === "id" ? "id" : "en",
          privacyMode: settings?.privacyMode ?? false,
          rainEnabled: settings?.rainEnabled ?? true,
          shizukuWebsiteUrl: "",
        },
      })
    );
  } catch (err) {
    console.error("SHIKAS store GET error:", err);
    return withEcosystemCors(
      req,
      NextResponse.json({ error: "LOAD_FAILED" }, { status: 500 })
    );
  }
}

export async function PUT(req: NextRequest) {
  const user = await getEcosystemUserFromRequest(req);
  if (!user) {
    return withEcosystemCors(
      req,
      NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    );
  }

  try {
    const raw = await req.json();
    const parsed = storeSchema.safeParse(raw);
    if (!parsed.success) {
      return withEcosystemCors(
        req,
        NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 })
      );
    }

    const { transactions, settings } = parsed.data;

    await prisma.$transaction(async (tx) => {
      await tx.shikasTransaction.deleteMany({
        where: { userId: user.id },
      });

      if (transactions.length > 0) {
        await tx.shikasTransaction.createMany({
          data: transactions.map((item) => ({
            id: item.id,
            userId: user.id,
            type: item.type,
            date: item.date,
            amountIdr: Math.round(item.amountIdr),
            categoryId: item.categoryId,
            note: item.note,
            merchant: item.merchant ?? null,
            createdAt: item.createdAt,
          })),
        });
      }

      if (settings) {
        await tx.shikasSettings.upsert({
          where: { userId: user.id },
          update: {
            locale: settings.locale,
            privacyMode: settings.privacyMode,
            rainEnabled: settings.rainEnabled,
          },
          create: {
            userId: user.id,
            locale: settings.locale,
            privacyMode: settings.privacyMode,
            rainEnabled: settings.rainEnabled,
          },
        });
      }
    });

    return withEcosystemCors(
      req,
      NextResponse.json({ ok: true, count: transactions.length })
    );
  } catch (err) {
    console.error("SHIKAS store PUT error:", err);
    return withEcosystemCors(
      req,
      NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 })
    );
  }
}
