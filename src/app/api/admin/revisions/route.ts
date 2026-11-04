import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { listRevisions, restoreRevision } from "@/lib/repository";
import { requireSession, validationResponse } from "@/lib/adminGuard";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = requireSession(request);
  if (denied) return denied;
  return NextResponse.json({ revisions: await listRevisions() });
}

export async function POST(request: Request) {
  const denied = requireSession(request);
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as { file?: unknown } | null;
  if (typeof body?.file !== "string") {
    return NextResponse.json({ message: "Falta la versión" }, { status: 400 });
  }

  try {
    const content = await restoreRevision(body.file);
    revalidatePath("/");
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    if (error instanceof Error && error.message === "Revision no valida") {
      return NextResponse.json({ message: "Versión no válida" }, { status: 400 });
    }
    return validationResponse(error);
  }
}
