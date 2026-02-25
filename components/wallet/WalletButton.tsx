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
  const [signedIn, setSignedIn] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  async function refreshMe() {
    const res = await fetch("/api/me", { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    setSignedIn(!!json.wallet);
  }

  useEffect(() => {
    // If wallet already connected in extension, pick it up
    const pk = window.solana?.publicKey?.toString?.();
    if (pk) setWallet(pk);

    // Check server session
    refreshMe();
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

      // Immediately sign-in (1-step UX)
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

      await refreshMe();
      setPhase("idle");
    } catch (e: any) {
      setPhase("idle");
      alert(e?.message || "Wallet connect failed");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshMe();
  }

  async function disconnect() {
    // Best effort: some wallets implement disconnect()
    try {
      await window.solana?.disconnect?.();
    } catch {
      // ignore
    }
    setWallet(null);

    // also log out server session to keep it clean
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshMe();
  }

  // UI
  if (!wallet) {
    return (
      <button className="coins-table-tab" type="button" onClick={connectAndSignIn} disabled={phase !== "idle"}>
        {phase === "connecting" ? "Connecting…" : phase === "signing" ? "Signing…" : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span className="mono">
        {wallet.slice(0, 4)}…{wallet.slice(-4)}
      </span>

      <span style={{ fontSize: 12, color: "var(--muted)" }}>
        {signedIn ? "Signed in" : "Connected"}
      </span>

      <button className="coins-table-tab" type="button" onClick={logout}>
        Logout
      </button>

      <button className="coins-table-tab" type="button" onClick={disconnect}>
        Disconnect
      </button>
    </div>
  );
}
