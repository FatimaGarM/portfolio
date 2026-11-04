import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { ensureUploadsDir, uploadsPath } from "@/lib/repository";
import { requireSession } from "@/lib/adminGuard";

export const runtime = "nodejs";

const MB = 1024 * 1024;
const allowed: Record<string, { kind: "image" | "video"; maxBytes: number }> = {
  ".jpg": { kind: "image", maxBytes: 8 * MB },
  ".jpeg": { kind: "image", maxBytes: 8 * MB },
  ".png": { kind: "image", maxBytes: 8 * MB },
  ".webp": { kind: "image", maxBytes: 8 * MB },
  ".gif": { kind: "image", maxBytes: 15 * MB },
  ".mp4": { kind: "video", maxBytes: 40 * MB },
  ".webm": { kind: "video", maxBytes: 40 * MB },
};

export async function POST(request: Request) {
  const denied = requireSession(request);
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Archivo no encontrado" }, { status: 400 });
  }

  const extension = path.extname(file.name).toLowerCase();
  const rule = allowed[extension];

  if (!rule || !file.type.startsWith(`${rule.kind}/`)) {
    return NextResponse.json({ message: "Formato no permitido" }, { status: 400 });
  }

  if (file.size > rule.maxBytes) {
    return NextResponse.json({ message: `El archivo pesa demasiado (máximo ${rule.maxBytes / MB} MB)` }, { status: 400 });
  }

  await ensureUploadsDir();

  const baseName = path
    .basename(file.name, extension)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const fileName = `${Date.now()}-${baseName || "archivo"}${extension}`;

  await writeFile(path.join(uploadsPath, fileName), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${fileName}` });
}
