export default function DevApplyPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Become a Verified Dev</h1>
          <p>SOL payment + socials + verification code (UI shell).</p>
        </div>
        <span className="badge">Dev Signup</span>
      </div>

      <div className="panel">
        <h3>Step 1 — Connect wallet</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
          Later: wallet connect + message signature.
        </p>
      </div>

      <div style={{ height: 12 }} />

      <div className="panel">
        <h3>Step 2 — Pay verification fee (SOL)</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
          Later: show platform wallet address + amount + payment detection.
        </p>
      </div>

      <div style={{ height: 12 }} />

      <div className="panel">
        <h3>Step 3 — Social proof</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
          Later: you’ll post a verification code on your socials and submit the link.
        </p>
      </div>

      <div style={{ height: 12 }} />

      <button className="button" type="button">
        Continue (later)
      </button>
    </>
  );
}
