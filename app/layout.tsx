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
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}
  >
    <div className="header">
      <Header />
    </div>

    <div className="subnav">
      <Subnav />
    </div>

    <main style={{ flex: 1 }}>
  {children}
</main>

    <footer className="footer">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>© {new Date().getFullYear()} AuthSwap</div>
          <div style={{ color: "rgba(255,255,255,.62)" }}>
            Filtered coins + verified dev listings • DYOR
          </div>
        </div>
      </div>
    </footer>
  </div>
</body>
    </html>
  );
}
