import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isRequestAuthenticated } from "@/lib/auth";
import { adminEnabled } from "@/lib/adminEnabled";

export function requireSession(request: Request) {
  if (!adminEnabled) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  try {
    if (isRequestAuthenticated(request)) return null;
  } catch {
    // Sin SESSION_SECRET no hay sesiones válidas
  }
  return NextResponse.json({ message: "No autorizado" }, { status: 401 });
}

export function validationResponse(error: unknown) {
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => `${issue.path.join(" › ") || "contenido"}: ${issue.message}`);
    return NextResponse.json({ message: "Hay campos que no son válidos", issues }, { status: 400 });
  }
  return NextResponse.json({ message: "No se pudo guardar" }, { status: 500 });
}
