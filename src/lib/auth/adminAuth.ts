import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "tt_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// Derive a signing key from environment variables with fallback
function getSigningSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "tap-toggle-nibm-secure-session-signing-secret-2026"
  );
}

export interface AdminSessionPayload {
  email: string;
  role: "dispatcher" | "admin";
  issuedAt: number;
  expiresAt: number;
}

/**
 * Signs a session payload using HMAC SHA-256
 */
function signToken(payload: AdminSessionPayload): string {
  const secret = getSigningSecret();
  const serialized = JSON.stringify(payload);
  const base64Payload = Buffer.from(serialized, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(base64Payload)
    .digest("base64url");
  return `${base64Payload}.${signature}`;
}

/**
 * Verifies and decodes a signed session token
 */
function verifyToken(token: string): AdminSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [base64Payload, signature] = parts;
    const secret = getSigningSecret();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(base64Payload)
      .digest("base64url");

    if (
      expectedSignature.length !== signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf8"),
        Buffer.from(signature, "utf8")
      )
    ) {
      return null;
    }

    const jsonStr = Buffer.from(base64Payload, "base64url").toString("utf8");
    const payload: AdminSessionPayload = JSON.parse(jsonStr);

    // Verify expiration
    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Creates a signed HttpOnly session cookie for an authenticated operator
 */
export async function createAdminSession(
  email: string,
  role: "dispatcher" | "admin" = "dispatcher"
): Promise<void> {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    email,
    role,
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE * 1000,
  };

  const token = signToken(payload);
  const cookieStore = cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Destroys the current operator session
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Verifies the admin session on the server.
 * Returns authentication status and operator payload.
 */
export async function verifyAdminSession(): Promise<{
  authenticated: boolean;
  user?: { email: string; role: string };
  error?: string;
}> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return {
        authenticated: false,
        error: "Unauthorized: Operator session cookie missing. Please sign in.",
      };
    }

    const payload = verifyToken(sessionCookie.value);
    if (!payload) {
      return {
        authenticated: false,
        error: "Unauthorized: Invalid or expired operator session. Please sign in again.",
      };
    }

    return {
      authenticated: true,
      user: {
        email: payload.email,
        role: payload.role,
      },
    };
  } catch (err: any) {
    return {
      authenticated: false,
      error: "Authentication verification failed.",
    };
  }
}
