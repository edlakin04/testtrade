"use client";

import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

export default function WalletButton() {
  const { publicKey, connected, signMessage, disconnect } = useWallet();
  const [signing, setSigning] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  async function refreshMe() {
    const res = await fetch("/api/me", { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    setSignedIn(!!json.wallet);
  }

  useEffect(() => {
    refreshMe();
  }, []);

  // Auto sign-in after connect
  useEffect(() => {
    let cancelled = false;

    async function autoSignIn() {
      if (!connected || !publicKey) return;
      if (signedIn) return; // already has session cookie
      if (!signMessage) return; // some wallets may not support message signing

      setSigning(true);
      try {
        const wallet = publicKey.toString();

        const nonceRes = await fetch("/api/auth/nonce", { cache: "no-store" });
        const { nonce } = await nonceRes.json();

        const message = `AuthSwap Sign-In\nWallet: ${wallet}\nNonce: ${nonce}`;
        const encoded = new TextEncoder().encode(message);

        const sigBytes = await signMessage(encoded);
        const signature = bs58.encode(sigBytes);

        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet, nonce, signature })
        });

        if (!verifyRes.ok) {
          const j = await verifyRes.json().catch(() => ({}));
          alert(j.error || "Sign-in failed");
          return;
        }

        if (!cancelled) await refreshMe();
      } finally {
        if (!cancelled) setSigning(false);
      }
    }

    autoSignIn();
    return () => {
      cancelled = true;
    };
  }, [connected, publicKey, signMessage, signedIn]);

  async function handleDisconnect() {
    // clear server session cookie
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setSignedIn(false);

    // disconnect wallet adapter
    await disconnect();
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <WalletMultiButton />

      {connected && (
        <>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {signing ? "Signing…" : signedIn ? "Signed in" : "Connected"}
          </span>

          <button className="coins-table-tab" type="button" onClick={handleDisconnect}>
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
