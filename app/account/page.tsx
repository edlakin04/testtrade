export default function AccountPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Account</h1>
          <p>Wallet-based account (UI shell).</p>
        </div>
        <span className="badge">Connect wallet later</span>
      </div>

      <div className="panel">
        <h3>Watchlist</h3>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          In later chunks, this will show tokens saved by your wallet.
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="panel">
        <h3>Holdings</h3>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          In later chunks, this will read your Solana holdings and show tokens you own.
        </div>
      </div>
    </>
  );
}
