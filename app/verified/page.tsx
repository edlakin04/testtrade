import CoinTable from "@/components/feeds/CoinTable";
import { MOCK_VERIFIED_TOKENS } from "@/lib/mock/tokens";

export default function VerifiedPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Verified Dev</h1>
          <p>Coins submitted by verified devs (mock data).</p>
        </div>
        <span className="badge">Dev submitted</span>
      </div>

      <CoinTable tokens={MOCK_VERIFIED_TOKENS} variant="verified" />
    </>
  );
}
