"use client";

import { useEffect, useState } from "react";
import bs58 from "bs58";

declare global {
  interface Window {
    solana?: any;
  }
}

export default function WalletButton() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "signing" | "done">("idle");

  useEffect(() => {
    // If already connected in wallet extension
    const pk = window.solana?.publicKey?.toString?.();
    if (pk) setWallet(pk);
  }, []);

  async function connect() {
    if (!window.solana) {
      alert("No Solana wallet found (install Phantom).");
      return;
    }
    setStatus("connecting");
    const res = await window.solana.connect();
    setWallet(res.publicKey.toString());
    setStatus("idle");
  }

  async function signIn() {
    if (!window.solana || !wallet) return;

    setStatus("signing");

    const nonceRes = await fetch("/api/auth/nonce", { cache: "no-store" });
    const { nonce } = await nonceRes.json();

    const message = `AuthSwap Sign-In\nWallet: ${wallet}\nNonce: ${nonce}`;
    const encoded = new TextEncoder().encode(message);

    const signed = await window.solana.signMessage(encoded, "utf8");
    const signatureBase58 = bs58.encode(signed.signature);

    const verifyRes = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, nonce, signature: signatureBase58 })
    });

    if (!verifyRes.ok) {
      const j = await verifyRes.json().catch(() => ({}));
      alert(j.error || "Sign-in failed");
      setStatus("idle");
      return;
    }

    setStatus("done");
    alert("Signed in ✅");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setStatus("idle");
    alert("Signed out");
  }

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {!wallet ? (
        <button className="coins-table-tab" type="button" onClick={connect}>
          {status === "connecting" ? "Connecting…" : "Connect"}
        </button>
      ) : (
        <>
          <span className="mono" style={{ alignSelf: "center" }}>
            {wallet.slice(0, 4)}…{wallet.slice(-4)}
          </span>

          <button className="coins-table-tab" type="button" onClick={signIn} disabled={status === "signing"}>
            {status === "signing" ? "Signing…" : "Sign In"}
          </button>

          <button className="coins-table-tab" type="button" onClick={logout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
