import CoinTabs from "@/components/feeds/CoinTabs";

export default function CoinsPage() {
  return (
    <div className="fullbleed">
      {/* Centered title block */}
      <div style={{ padding: "18px 18px 10px" }}>
        <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 20, letterSpacing: "-0.03em" }}>
            Coins
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--muted)" }}>
            Filtered and verified dev coins.
          </p>
        </div>
      </div>

      {/* Centered tabs */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 18px 10px" }}>
        <CoinTabs centered />
      </div>
    </div>
  );
}
