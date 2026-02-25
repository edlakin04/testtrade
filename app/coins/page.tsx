import CoinTabs from "@/components/feeds/CoinTabs";

export default function CoinsPage() {
  return (
    <div className="fullbleed">
      <div style={{ padding: "18px 18px 10px" }}>
        <h1 style={{ margin: 0, fontSize: 18, letterSpacing: "-0.03em" }}>
          Coins
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>
          Filtered and verified dev coins.
        </p>
      </div>

      {/* Tabs + table are one flow */}
      <div style={{ padding: "0 18px 18px" }}>
        <CoinTabs />
      </div>
    </div>
  );
}
