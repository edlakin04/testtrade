import CoinTable from "@/components/feeds/CoinTable";
import { MOCK_FILTERED_TOKENS } from "@/lib/mock/tokens";

export default function FilteredPage() {
  return (
    <>
      <div className="page-title">
        <div>
          <h1>Filtered</h1>
          <p>Recently created coins that passed AuthSwap’s basic risk filter (mock data).</p>
        </div>
        <span className="badge">Default tab</span>
      </div>

      <CoinTable tokens={MOCK_FILTERED_TOKENS} variant="filtered" />
    </>
  );
}
