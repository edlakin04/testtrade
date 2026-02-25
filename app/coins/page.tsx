import CoinTabs from "@/components/feeds/CoinTabs";

export default function CoinsPage() {
  return (
    <div style={{ padding: "18px 24px 0 24px" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 18, letterSpacing: "-0.03em" }}>
          Coins
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>
          Filtered and verified dev coins.
        </p>
      </div>

      <CoinTabs />
    </div>
  );
}
