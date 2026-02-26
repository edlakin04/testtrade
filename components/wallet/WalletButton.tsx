"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";

export default function WalletButton() {
  const { publicKey, connected, signMessage, disconnect } = useWallet();
  const { setVisible, visible } = useWalletModal();

  const [signing, setSigning] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  // Only show "Change" if they tried to connect (opened modal) and then cancelled
  const [attempted, setAttempted] = useState(false);

  const short = useMemo(() => {
    if (!publicKey) return "";
    const s = publicKey.toString();
    return `${s.slice(0, 4)}…${s.slice(-4)}`;
  }, [publicKey]);

  async function refreshMe() {
    const res = await fetch("/api/me", { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    setSignedIn(!!json.wallet);
  }

  useEffect(() => {
    refreshMe();
  }, []);

  // Track "attempted" when they open the modal
  useEffect(() => {
    if (visible) setAttempted(true);
  }, [visible]);

  // Auto sign-in once connected
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

  // NOT CONNECTED: show our clean button, and show Change only if they previously attempted
  if (!connected) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          type="button"
          className="as-connect-btn"
          onClick={() => setVisible(true)}
        >
          Connect 
        </button>

        {attempted && (
          <button
            type="button"
            className="as-change-btn"
            onClick={() => setVisible(true)}
          >
            Change
          </button>
        )}
      </div>
    );
  }

  // CONNECTED: show their original address button + dropdown (keeps their style)
  return (
    <div className="wallet-toplayer" style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <WalletMultiButton />

      <span className="mono">{short}</span>
      <span style={{ fontSize: 12, color: "var(--muted)" }}>
        {signing ? "Signing…" : signedIn ? "Signed in" : "Connected"}
      </span>

      <button className="coins-table-tab" type="button" onClick={handleDisconnect}>
        Disconnect
      </button>
    </div>
  );
}
