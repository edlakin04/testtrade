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

// Wallet Standard (Backpack + other standard wallets auto-detected)
import { WalletStandardWalletAdapter } from "@solana/wallet-standard-wallet-adapter-react";

export default function WalletProviders({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  const wallets = useMemo(
    () => [
      // Wallet Standard should be first so standard wallets (e.g. Backpack) show up automatically
      new WalletStandardWalletAdapter(),

      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new GlowWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TrustWalletAdapter()
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
