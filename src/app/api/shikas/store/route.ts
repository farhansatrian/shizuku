import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  ecosystemPreflight,
  getEcosystemUserFromRequest,
  withEcosystemCors,
} from "@/lib/ecosystem-auth";

const accountSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1).max(60),
  role: z.enum(["daily", "savings"]).default("daily"),
  openingBalanceIdr: z.number().int().min(0),
  color: z.string().min(3).max(32).default("#745bc7"),
  isDefault: z.boolean().optional(),
});

const reimburseEntrySchema = z.object({
  id: z.string().min(1).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amountIdr: z.number().int().positive(),
  accountId: z.string().min(1).max(80).optional(),
  note: z.string().max(120).optional(),
  createdAt: z.string().min(1).max(64),
});

const reimburseSchema = z.object({
  status: z.enum(["pending", "settled"]),
  expectedIdr: z.number().int().positive().optional(),
  from: z.string().max(80).optional(),
  settledAt: z.string().max(64).optional(),
  entries: z.array(reimburseEntrySchema).max(50).default([]),
});

const txSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(["income", "expense", "transfer"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amountIdr: z.number().int().positive(),
  categoryId: z.string().min(1).max(60),
  note: z.string().max(240),
  merchant: z.string().max(120).optional(),
  accountId: z.string().min(1).max(80).optional(),
  toAccountId: z.string().min(1).max(80).optional(),
  feeIdr: z.number().int().min(0).optional(),
  reimburse: reimburseSchema.optional(),
  createdAt: z.string().min(1).max(64),
});

const storeSchema = z.object({
  version: z.number().int().optional(),
  accounts: z.array(accountSchema).max(30).optional(),
  transactions: z.array(txSchema).max(5000),
  settings: z
    .object({
      locale: z.enum(["en", "id"]).default("en"),
      privacyMode: z.boolean().default(false),
      rainEnabled: z.boolean().default(true),
      cycleStartDay: z.number().int().min(1).max(28).default(1),
      shizukuWebsiteUrl: z.string().optional(),
    })
    .optional(),
});

function parseStoredAccounts(raw: string | null | undefined) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const validated = z.array(accountSchema).safeParse(parsed);
    return validated.success ? validated.data : [];
  } catch {
    return [];
  }
}

function parseStoredReimburse(raw: string | null | undefined) {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw);
    const validated = reimburseSchema.safeParse(parsed);
    return validated.success ? validated.data : undefined;
  } catch {
    return undefined;
  }
}

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
        version: 5,
        accounts: parseStoredAccounts(settings?.accountsJson),
        transactions: rows.map((r) => ({
          id: r.id,
          type:
            r.type === "income"
              ? "income"
              : r.type === "transfer"
                ? "transfer"
                : "expense",
          date: r.date,
          amountIdr: r.amountIdr,
          categoryId: r.categoryId,
          note: r.note,
          merchant: r.merchant ?? undefined,
          accountId: r.accountId ?? undefined,
          toAccountId: r.toAccountId ?? undefined,
          feeIdr: r.feeIdr > 0 ? r.feeIdr : undefined,
          reimburse:
            r.type === "expense"
              ? parseStoredReimburse(r.reimburseJson)
              : undefined,
          createdAt: r.createdAt,
        })),
        settings: {
          locale: settings?.locale === "id" ? "id" : "en",
          privacyMode: settings?.privacyMode ?? false,
          rainEnabled: settings?.rainEnabled ?? true,
          cycleStartDay: Math.min(
            28,
            Math.max(1, settings?.cycleStartDay ?? 1)
          ),
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

    const { accounts, transactions, settings } = parsed.data;
    const serializedAccounts =
      accounts !== undefined ? JSON.stringify(accounts) : undefined;

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
            accountId: item.accountId ?? null,
            toAccountId: item.toAccountId ?? null,
            feeIdr: Math.max(0, Math.round(item.feeIdr ?? 0)),
            reimburseJson:
              item.type === "expense" && item.reimburse
                ? JSON.stringify(item.reimburse)
                : null,
            createdAt: item.createdAt,
          })),
        });
      }

      if (settings || serializedAccounts !== undefined) {
        await tx.shikasSettings.upsert({
          where: { userId: user.id },
          update: {
            ...(settings
              ? {
                  locale: settings.locale,
                  privacyMode: settings.privacyMode,
                  rainEnabled: settings.rainEnabled,
                  cycleStartDay: settings.cycleStartDay,
                }
              : {}),
            ...(serializedAccounts !== undefined
              ? { accountsJson: serializedAccounts }
              : {}),
          },
          create: {
            userId: user.id,
            locale: settings?.locale ?? "en",
            privacyMode: settings?.privacyMode ?? false,
            rainEnabled: settings?.rainEnabled ?? true,
            cycleStartDay: settings?.cycleStartDay ?? 1,
            accountsJson: serializedAccounts ?? "[]",
          },
        });
      }
    });

    return withEcosystemCors(
      req,
      NextResponse.json({
        ok: true,
        count: transactions.length,
        accountsCount: accounts?.length ?? 0,
      })
    );
  } catch (err) {
    console.error("SHIKAS store PUT error:", err);
    return withEcosystemCors(
      req,
      NextResponse.json({ error: "SAVE_FAILED" }, { status: 500 })
    );
  }
}
