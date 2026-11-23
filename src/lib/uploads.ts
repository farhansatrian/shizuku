import "server-only";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import crypto from "node:crypto";

const ALLOWED_MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB (supports lossless HD artwork)

export function getUploadDirectory(): string {
  const envDir = process.env.UPLOAD_DIR || "./data/uploads";
  return path.isAbsolute(envDir)
    ? envDir
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), envDir);
}

export function isSafeFilename(filename: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(filename) && !filename.includes("..");
}

export function getContentTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

export async function saveUploadedFile(file: File): Promise<{
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}> {
  const ext = ALLOWED_MIME_EXT[file.type];
  if (!ext) {
    throw new Error(
      "Unsupported file type. Allowed: JPG, PNG, WebP, GIF, AVIF, or PDF."
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large. Maximum allowed size is 25 MB.");
  }

  const uploadDir = getUploadDirectory();
  await mkdir(uploadDir, { recursive: true });

  const stamp = Date.now().toString(36);
  const rand = crypto.randomBytes(6).toString("hex");
  const filename = `shizuku-${stamp}-${rand}${ext}`;
  const fullPath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return {
    url: `/api/uploads/${filename}`,
    filename,
    size: file.size,
    mimeType: file.type,
  };
}
