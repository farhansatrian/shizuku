import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Recreate cached dev client automatically if Prisma schema added new models
const existing = globalForPrisma.prisma;
const hasAllDelegates =
  existing !== undefined &&
  typeof (existing as unknown as Record<string, unknown>).workspaceApp ===
    "object";

export const prisma = hasAllDelegates ? existing : createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
