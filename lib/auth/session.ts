import crypto from "crypto";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/db/supabaseServer";

const COOKIE_NAME = "authswap_session";

function required(name: string, v: string | undefined) {
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function hmac(input: string) {
  const secret = required("AUTH_SESSION_SECRET", process.env.AUTH_SESSION_SECRET);
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

/**
 * Session token format: <random>.<hmac>
 * Store only sha256(token) in DB.
 */
export function makeSessionToken() {
  const rand = crypto.randomBytes(32).toString("hex");
  const sig = hmac(rand);
  return `${rand}.${sig}`;
}

export function isValidSessionToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [rand, sig] = parts;
  return hmac(rand) === sig;
}

export async function setSessionCookie(token: string, maxAgeSeconds: number) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export async function getSessionWallet(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  if (!isValidSessionToken(token)) return null;

  const supabase = supabaseServer();
  const tokenHash = sha256(token);

  const { data, error } = await supabase
    .from("auth_sessions")
    .select("wallet, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !data) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  return data.wallet as string;
}

export async function createSession(wallet: string) {
  const supabase = supabaseServer();
  const token = makeSessionToken();
  const tokenHash = sha256(token);

  const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000).toISOString();

  const { error } = await supabase.from("auth_sessions").insert({
    wallet,
    token_hash: tokenHash,
    expires_at: expiresAt
  });

  if (error) throw new Error(error.message);

  await setSessionCookie(token, maxAgeSeconds);
  return { token, expiresAt };
}
