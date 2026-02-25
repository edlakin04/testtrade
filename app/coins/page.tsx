import CoinTabs from "@/components/feeds/CoinTabs";

export default function CoinsPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Coins</h1>
          <p>Filtered and Verified Dev coins (mock data). Tabs live here.</p>
        </div>
        <span className="badge">AuthSwap</span>
      </div>

      <CoinTabs />
    </>
  );
}
