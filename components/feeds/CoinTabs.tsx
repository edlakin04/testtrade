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
      <div className="coins-subbar">
        <div className="coins-subbar-inner">
          <button
            type="button"
            className={`coins-tab ${tab === "filtered" ? "active" : ""}`}
            onClick={() => setTab("filtered")}
          >
            Filtered
          </button>
          <button
            type="button"
            className={`coins-tab ${tab === "verified" ? "active" : ""}`}
            onClick={() => setTab("verified")}
          >
            Verified Dev
          </button>
        </div>
      </div>

      <CoinTable tokens={tokens} />
    </>
  );
}
