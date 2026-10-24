import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Single-admin auth: the password lives in ADMIN_PASSWORD and the session is
 * an HMAC-signed expiry timestamp in an httpOnly cookie (key: SESSION_SECRET).
 */
const SESSION_COOKIE = "admin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }
  return "development-only-session-secret-change-me";
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

/** Constant-time comparison that also hides the length of the expected value. */
function safeEqual(a: string, b: string): boolean {
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && safeEqual(password, expected);
}

export async function createSession(): Promise<void> {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  (await cookies()).set(SESSION_COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  // The expiry check reads the clock, so this must run at request time.
  await connection();
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  const [expires, signature] = value?.split(".") ?? [];
  if (!expires || !signature || !safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
