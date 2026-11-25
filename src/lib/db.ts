import "server-only";
import { PrismaClient } from "@prisma/client";

const PRISMA_SCHEMA_VERSION = 2;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaVersion?: number;
};

function createClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Recreate cached dev client automatically if Prisma schema added new models or columns
const existing = globalForPrisma.prisma;
const rec = existing as unknown as Record<string, unknown> | undefined;
const hasAllDelegates =
  rec !== undefined &&
  globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION &&
  typeof rec.workspaceApp === "object" &&
  typeof rec.ecosystemUser === "object" &&
  typeof rec.shikasTransaction === "object" &&
  typeof rec.shikasSettings === "object";

export const prisma: PrismaClient =
  hasAllDelegates && existing ? existing : createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}
