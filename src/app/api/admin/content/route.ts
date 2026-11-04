import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readContent, saveContent } from "@/lib/repository";
import { requireSession, validationResponse } from "@/lib/adminGuard";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = requireSession(request);
  if (denied) return denied;
  return NextResponse.json({ content: await readContent() });
}

export async function PUT(request: Request) {
  const denied = requireSession(request);
  if (denied) return denied;

  try {
    const content = await saveContent(await request.json());
    revalidatePath("/");
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    return validationResponse(error);
  }
}
