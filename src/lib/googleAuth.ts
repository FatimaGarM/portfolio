import { createHash, randomBytes } from "node:crypto";

// Login con Google: OAuth 2.0 / OpenID Connect, código de autorización con PKCE.
// Solo entra la cuenta de ADMIN_EMAIL.

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const ISSUERS = new Set(["https://accounts.google.com", "accounts.google.com"]);

export const OAUTH_COOKIE = "portfolio_google_oauth";
export const OAUTH_COOKIE_MAX_AGE = 60 * 10;

export type GoogleAuthErrorCode = "config" | "estado" | "google" | "no-autorizado";

export class GoogleAuthError extends Error {
  code: GoogleAuthErrorCode;
  constructor(code: GoogleAuthErrorCode) {
    super(code);
    this.code = code;
  }
}

export function googleConfig(requestOrigin: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  // En producción la URL sale de APP_URL y no de la cabecera Host
  const appUrl = (process.env.APP_URL?.trim() || (process.env.NODE_ENV === "production" ? "" : requestOrigin)).replace(/\/$/, "");
  if (!clientId || !clientSecret || !adminEmail || !appUrl) throw new GoogleAuthError("config");
  return { clientId, clientSecret, adminEmail, redirectUri: `${appUrl}/api/admin/login/callback` };
}

const base64url = (buffer: Buffer) => buffer.toString("base64url");

export function createAuthorization(config: ReturnType<typeof googleConfig>) {
  const state = base64url(randomBytes(32));
  const verifier = base64url(randomBytes(48));
  const challenge = base64url(createHash("sha256").update(verifier).digest());

  const url = new URL(AUTH_ENDPOINT);
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    login_hint: config.adminEmail,
    prompt: "select_account",
  }).toString();

  return { url: url.toString(), cookieValue: `${state}.${verifier}` };
}

type IdTokenClaims = { iss?: string; aud?: string; exp?: number; email?: string; email_verified?: boolean | string };

function checkClaims(claims: IdTokenClaims, config: { clientId: string; adminEmail: string }, now = Date.now()) {
  if (!claims.iss || !ISSUERS.has(claims.iss)) return false;
  if (claims.aud !== config.clientId) return false;
  if (!claims.exp || claims.exp * 1000 < now) return false;
  if (claims.email_verified !== true && claims.email_verified !== "true") return false;
  return (claims.email || "").toLowerCase() === config.adminEmail;
}

export async function finishAuthorization(
  config: ReturnType<typeof googleConfig>,
  params: { code: string | null; state: string | null; cookieValue: string | undefined }
) {
  const [expectedState, verifier] = (params.cookieValue || "").split(".");
  if (!params.code || !params.state || !expectedState || !verifier || params.state !== expectedState) {
    throw new GoogleAuthError("estado");
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: params.code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new GoogleAuthError("google");

  const { id_token: idToken } = (await response.json()) as { id_token?: string };
  const payload = idToken?.split(".")[1];
  if (!payload) throw new GoogleAuthError("google");

  // El id_token viene directo del endpoint de Google por TLS, así que no hace
  // falta comprobar la firma, solo los claims (OIDC Core 3.1.3.7).
  let claims: IdTokenClaims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    throw new GoogleAuthError("google");
  }
  if (!checkClaims(claims, config)) throw new GoogleAuthError("no-autorizado");
  return config.adminEmail;
}
