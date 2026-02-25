"use client";

import { useMemo, useState } from "react";
import CoinTable from "@/components/feeds/CoinTable";
import { MOCK_FILTERED_TOKENS, MOCK_VERIFIED_TOKENS } from "@/lib/mock/tokens";

export default function CoinTabs() {
  const [tab, setTab] = useState<"filtered" | "verified">("filtered");

  const tokens = useMemo(() => {
    return tab === "filtered" ? MOCK_FILTERED_TOKENS : MOCK_VERIFIED_TOKENS;
  }, [tab]);

  return (
    <>
  <div style={{ maxWidth: 1400, margin: "0 auto" }}>
    <div className="tabs">
      <button
        type="button"
        className={`tab ${tab === "filtered" ? "active" : ""}`}
        onClick={() => setTab("filtered")}
      >
        Filtered
      </button>
      <button
        type="button"
        className={`tab ${tab === "verified" ? "active" : ""}`}
        onClick={() => setTab("verified")}
      >
        Verified Dev
      </button>
    </div>
  </div>

  <div style={{ padding: "0 24px 24px 24px" }}>
    <CoinTable tokens={tokens} variant={tab} />
  </div>
</>
  );
}
