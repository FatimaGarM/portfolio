import { NextResponse } from "next/server";
import { adminEnabled } from "@/lib/adminEnabled";

// En producción el panel y su API no existen: 404 sin llegar a las rutas.
export function proxy() {
  if (adminEnabled) return NextResponse.next();
  return new NextResponse("Not Found", { status: 404 });
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"],
};
