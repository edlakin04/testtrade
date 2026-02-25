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
    <div className="coins-table-shell">
      <div className="coins-table-header">
        <button
          type="button"
          className={`coins-table-tab ${tab === "filtered" ? "active" : ""}`}
          onClick={() => setTab("filtered")}
        >
          Filtered
        </button>
        <button
          type="button"
          className={`coins-table-tab ${tab === "verified" ? "active" : ""}`}
          onClick={() => setTab("verified")}
        >
          Verified
        </button>
      </div>

      <CoinTable tokens={tokens} />
    </div>
  );
}
