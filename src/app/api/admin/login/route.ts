import { NextResponse, type NextRequest } from "next/server";
import { GoogleAuthError, OAUTH_COOKIE, OAUTH_COOKIE_MAX_AGE, createAuthorization, googleConfig } from "@/lib/googleAuth";

export const runtime = "nodejs";

// Inicia el login: guarda state y code_verifier en una cookie y redirige a Google.
export async function GET(request: NextRequest) {
  try {
    const config = googleConfig(request.nextUrl.origin);
    const { url, cookieValue } = createAuthorization(config);
    const response = NextResponse.redirect(url);
    response.cookies.set(OAUTH_COOKIE, cookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/admin/login",
      maxAge: OAUTH_COOKIE_MAX_AGE,
    });
    return response;
  } catch (error) {
    const code = error instanceof GoogleAuthError ? error.code : "google";
    return NextResponse.redirect(new URL(`/admin?error=${code}`, request.nextUrl.origin));
  }
}
