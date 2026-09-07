import type { AuthUser } from "./types";

const DEFAULT_EXPIRY_SECONDS = 60 * 60;

function base64UrlEncode(input: string): string {
  const base64 = btoa(unescape(encodeURIComponent(input)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(escape(atob(padded)));
}

/**
 * Builds a real JWT-shaped string (header.payload.signature) for the mock
 * session. The signature segment is a placeholder — nothing verifies it —
 * since a real Auth0 SDK will issue and verify actual signed tokens later.
 */
export function createMockJwt(
  user: AuthUser,
  expiresInSeconds: number = DEFAULT_EXPIRY_SECONDS,
): string {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: "none", typ: "JWT" };
  const payload = { ...user, iat: nowSeconds, exp: nowSeconds + expiresInSeconds };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.mock-signature`;
}

/**
 * Decodes a mock JWT and returns its user claims, or null if the token is
 * missing, malformed, missing required claims, or expired.
 */
export function decodeMockJwt(token: string | null): AuthUser | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as AuthUser & {
      exp?: number;
    };

    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
      return null;
    }

    const { sub, name, email, picture } = payload;
    if (!sub || !name || !email) return null;

    return { sub, name, email, picture };
  } catch {
    return null;
  }
}
