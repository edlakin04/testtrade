import { NextResponse } from "next/server";
import { makeNonce } from "@/lib/auth/nonce";

export async function GET() {
  // No DB needed for nonce: client signs it immediately.
  // Later we can store to prevent replay, but OK for Chunk 3.
  const nonce = makeNonce();
  return NextResponse.json({ nonce });
}
