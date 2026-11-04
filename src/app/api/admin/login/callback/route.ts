import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/auth";
import { GoogleAuthError, OAUTH_COOKIE, finishAuthorization, googleConfig } from "@/lib/googleAuth";

export const runtime = "nodejs";

// Vuelta desde Google: si la cuenta es la de ADMIN_EMAIL, se crea la sesión.
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  let target = "/admin";
  let sessionToken: string | null = null;

  try {
    if (request.nextUrl.searchParams.get("error")) throw new GoogleAuthError("google");
    const config = googleConfig(origin);
    const email = await finishAuthorization(config, {
      code: request.nextUrl.searchParams.get("code"),
      state: request.nextUrl.searchParams.get("state"),
      cookieValue: request.cookies.get(OAUTH_COOKIE)?.value,
    });
    sessionToken = createSessionToken(email);
  } catch (error) {
    const code = error instanceof GoogleAuthError ? error.code : "config";
    target = `/admin?error=${code}`;
  }

  const response = NextResponse.redirect(new URL(target, origin));
  response.cookies.set(OAUTH_COOKIE, "", { path: "/api/admin/login", maxAge: 0 });
  if (sessionToken) response.cookies.set(SESSION_COOKIE, sessionToken, sessionCookieOptions);
  return response;
}
