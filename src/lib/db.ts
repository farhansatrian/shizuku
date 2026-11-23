import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  sqliteWalInitialized?: boolean;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Enable SQLite WAL mode once for smoother concurrent reads & admin writes
if (!globalForPrisma.sqliteWalInitialized) {
  globalForPrisma.sqliteWalInitialized = true;
  prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;").catch(() => {
    // Non-fatal if DB file is not created yet during build phase
  });
}
