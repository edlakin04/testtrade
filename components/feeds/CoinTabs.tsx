"use client";

import { useMemo, useState } from "react";
import CoinTable from "@/components/feeds/CoinTable";
import { MOCK_FILTERED_TOKENS, MOCK_VERIFIED_TOKENS } from "@/lib/mock/tokens";

export default function CoinTabs({ centered }: { centered?: boolean }) {
  const [tab, setTab] = useState<"filtered" | "verified">("filtered");

  const tokens = useMemo(() => {
    return tab === "filtered" ? MOCK_FILTERED_TOKENS : MOCK_VERIFIED_TOKENS;
  }, [tab]);

 return (
  <div style={{ width: "100%" }}>
    <div className="tabs" style={{ maxWidth: 520 }}>
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

    <div style={{ marginTop: 10 }}>
      <CoinTable tokens={tokens} variant={tab} />
    </div>
  </div>
);
}
