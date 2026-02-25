export default function SwapMock({ baseSymbol }: { baseSymbol: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.10)",
        padding: 12,
        background: "#fff"
      }}
    >
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
        Buy/Sell via Jupiter (later)
      </div>

      <div className="kv">
        <div className="k">From</div><div>SOL</div>
        <div className="k">To</div><div>{baseSymbol}</div>
        <div className="k">Slippage</div><div>0.5% (mock)</div>
      </div>

      <div style={{ height: 12 }} />

      <button
        style={{
          width: "100%",
          border: "1px solid var(--border)",
          background: "#fff",
          padding: "10px 12px",
          cursor: "pointer",
          fontWeight: 600
        }}
        type="button"
      >
        Connect wallet (later)
      </button>
    </div>
  );
}
