import { NextResponse } from "next/server";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { createSession } from "@/lib/auth/session";

type Body = {
  wallet: string;
  nonce: string;
  signature: string; // base58
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const wallet = (body.wallet || "").trim();
  const nonce = (body.nonce || "").trim();
  const signature = (body.signature || "").trim();

  if (!wallet || !nonce || !signature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // message must match exactly what client signs
  const message = `AuthSwap Sign-In\nWallet: ${wallet}\nNonce: ${nonce}`;

  let pubkey: PublicKey;
  try {
    pubkey = new PublicKey(wallet);
  } catch {
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });
  }

  let sigBytes: Uint8Array;
  try {
    sigBytes = bs58.decode(signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature encoding" }, { status: 400 });
  }

  const ok = nacl.sign.detached.verify(
    new TextEncoder().encode(message),
    sigBytes,
    pubkey.toBytes()
  );

  if (!ok) {
    return NextResponse.json({ error: "Signature verify failed" }, { status: 401 });
  }

  await createSession(wallet);

  return NextResponse.json({ ok: true });
}
