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
      <div style={{ display: "flex", justifyContent: centered ? "center" : "flex-start" }}>
        <div className="tabs" style={{ maxWidth: 520, width: "100%" }}>
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

      <div style={{ padding: "0 18px 18px" }}>
        <CoinTable tokens={tokens} variant={tab} />
      </div>
    </div>
  );
}
