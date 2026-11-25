import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import {
  getContentTypeFromFilename,
  getUploadDirectory,
  isSafeFilename,
} from "@/lib/uploads";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  if (!isSafeFilename(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const fullPath = path.join(getUploadDirectory(), filename);
  try {
    const info = await stat(fullPath);
    if (!info.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const isImmutableUpload = /^shizuku-[a-z0-9]+-[a-f0-9]+\./i.test(filename);
    const cacheControl = isImmutableUpload
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600, stale-while-revalidate=86400";

    const etag = `"${info.size}-${Math.floor(info.mtimeMs)}"`;
    if (_req.headers.get("if-none-match") === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": cacheControl,
        },
      });
    }
    const data = await readFile(fullPath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": getContentTypeFromFilename(filename),
        "Content-Length": String(data.length),
        ETag: etag,
        "Cache-Control": cacheControl,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
