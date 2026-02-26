"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletModalButton
} from "@solana/wallet-adapter-react-ui";
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

  // Auto sign-in after connect (keeps your 1-step experience)
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

  // Not connected: show OUR button + a small "Change" to reopen modal if they cancelled a wallet
  if (!connected) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Opens wallet modal */}
        <WalletModalButton className="as-connect">
          Connect Wallet
        </WalletModalButton>

        {/* If they clicked a wallet and cancelled, this still lets them reopen and choose another */}
        <WalletModalButton className="as-change">
          Change
        </WalletModalButton>
      </div>
    );
  }

  // Connected: keep THEIR button and dropdown exactly as-is
  return (
    <div className="wallet-toplayer" style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <WalletMultiButton />

      <span style={{ fontSize: 12, color: "var(--muted)" }}>
        {signing ? "Signing…" : signedIn ? "Signed in" : "Connected"}
      </span>

      <button className="coins-table-tab" type="button" onClick={handleDisconnect}>
        Disconnect
      </button>
    </div>
  );
}
