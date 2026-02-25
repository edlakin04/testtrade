import CoinTabs from "@/components/feeds/CoinTabs";

export default function CoinsPage() {
  return (
    <div className="fullbleed">
      <div className="coins-title">
        <h1>Coins</h1>
        <p>Filtered and verified dev coins.</p>
      </div>

      <CoinTabs />
    </div>
  );
}
