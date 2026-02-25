"use client";

import { useEffect, useState } from "react";
import bs58 from "bs58";

declare global {
  interface Window {
    solana?: any;
  }
}

type Phase = "idle" | "connecting" | "signing";

export default function WalletButton() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const pk = window.solana?.publicKey?.toString?.();
    if (pk) setWallet(pk);
  }, []);

  async function connectAndSignIn() {
    if (!window.solana) {
      alert("No Solana wallet found (install Phantom).");
      return;
    }

    try {
      setPhase("connecting");
      const res = await window.solana.connect();
      const pubkey = res.publicKey.toString();
      setWallet(pubkey);

      // auto sign-in (still required for security, but 1-step UX)
      setPhase("signing");

      const nonceRes = await fetch("/api/auth/nonce", { cache: "no-store" });
      const { nonce } = await nonceRes.json();

      const message = `AuthSwap Sign-In\nWallet: ${pubkey}\nNonce: ${nonce}`;
      const encoded = new TextEncoder().encode(message);

      const signed = await window.solana.signMessage(encoded, "utf8");
      const signatureBase58 = bs58.encode(signed.signature);

      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: pubkey, nonce, signature: signatureBase58 })
      });

      if (!verifyRes.ok) {
        const j = await verifyRes.json().catch(() => ({}));
        alert(j.error || "Sign-in failed");
        setPhase("idle");
        return;
      }

      setPhase("idle");
    } catch (e: any) {
      setPhase("idle");
      alert(e?.message || "Wallet connect failed");
    }
  }

  async function disconnect() {
    // clear server session cookie (even if you don't show "logout")
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});

    // try to disconnect wallet
    try {
      await window.solana?.disconnect?.();
    } catch {
      // some wallets are inconsistent; ignore
    }

    setWallet(null);
  }

  if (!wallet) {
    return (
      <button
        className="coins-table-tab"
        type="button"
        onClick={connectAndSignIn}
        disabled={phase !== "idle"}
      >
        {phase === "connecting"
          ? "Connecting…"
          : phase === "signing"
          ? "Signing…"
          : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span className="mono">
        {wallet.slice(0, 4)}…{wallet.slice(-4)}
      </span>

      <button className="coins-table-tab" type="button" onClick={disconnect}>
        Disconnect
      </button>
    </div>
  );
}
