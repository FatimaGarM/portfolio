import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_DURATION = 60 * 60 * 8;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET debe tener al menos 32 caracteres");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function equal(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

export function createSessionToken(email: string) {
  const payload = Buffer.from(JSON.stringify({
    email,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION,
    nonce: randomBytes(16).toString("hex"),
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token?: string) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !equal(signature, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: string; expiresAt: number };
    // Si cambia ADMIN_EMAIL, las sesiones anteriores dejan de valer
    const admin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    return Boolean(admin) && (data.email || "").toLowerCase() === admin && data.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAuthenticated() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export function isRequestAuthenticated(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const value = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.split("=").slice(1).join("=");
  return verifySessionToken(value ? decodeURIComponent(value) : undefined);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION,
};
