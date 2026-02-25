"use client";

import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase";
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";

import { useStandardWalletAdapters } from "@solana/wallet-standard-wallet-adapter-react";

export default function WalletProviders({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  // Wallet Standard adapters (Backpack shows up here if installed)
  const standardAdapters = useStandardWalletAdapters({});

  // Explicit adapters we always want in the modal
  const explicitAdapters = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new GlowWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter()
    ],
    []
  );

  // Merge them (dedupe by name)
  const wallets = useMemo(() => {
    const all = [...standardAdapters, ...explicitAdapters];
    const seen = new Set<string>();
    return all.filter((w: any) => {
      const n = w?.name || "";
      if (!n) return true;
      if (seen.has(n)) return false;
      seen.add(n);
      return true;
    });
  }, [standardAdapters, explicitAdapters]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
