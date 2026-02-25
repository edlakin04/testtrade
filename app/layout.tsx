import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/site/Header";
import Subnav from "@/components/site/Subnav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuthSwap",
  description: "Filtered Solana memecoins + verified dev listings."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="header">
          <Header />
        </div>
        <div className="subnav">
          <Subnav />
        </div>

        <main className="container">{children}</main>

        <footer className="footer">
          <div className="container">
            AuthSwap — filtered discovery and verified dev listings. (UI shell)
          </div>
        </footer>
      </body>
    </html>
  );
}
