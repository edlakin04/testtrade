export default function HowItWorksPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>How it works</h1>
          <p>Clear disclaimer and what “filtered” means (placeholder).</p>
        </div>
      </div>

      <div className="panel">
        <h3>Filtered coins</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
          “Filtered” means the coin passed basic automated checks intended to reduce obvious rugs.
          It does not guarantee safety. Always do your own research.
        </p>
      </div>

      <div style={{ height: 14 }} />

      <div className="panel">
        <h3>Verified dev coins</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
          “Verified dev” means the dev completed payment + wallet verification + social proof (verification code).
          This does not guarantee performance or integrity.
        </p>
      </div>
    </>
  );
}
