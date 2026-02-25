"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletModalButton } from "@solana/wallet-adapter-react-ui";
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
      if (signedIn) return;
      if (!signMessage) return;

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
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setSignedIn(false);
    await disconnect();
  }

  const short = publicKey ? `${publicKey.toString().slice(0, 4)}…${publicKey.toString().slice(-4)}` : "";

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      {/* Always lets you choose/change wallet */}
      <WalletModalButton>
        {connected ? "Change wallet" : "Select wallet"}
      </WalletModalButton>

      {connected && (
        <>
          <span className="mono">{short}</span>
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
