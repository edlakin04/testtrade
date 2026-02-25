"use client";

import { useEffect, useState } from "react";
import CoinTable from "@/components/feeds/CoinTable";
import type { TokenListItem } from "@/types";

export default function CoinTabs() {
  const [tab, setTab] = useState<"filtered" | "verified">("filtered");
  const [tokens, setTokens] = useState<TokenListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tokens?type=${tab}`, { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setTokens(json.tokens || []);
      } catch {
        if (!cancelled) setTokens([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
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

        <span style={{ marginLeft: 12, fontSize: 13, color: "var(--muted)" }}>
          {loading ? "Loading…" : `${tokens.length} shown`}
        </span>
      </div>

      <CoinTable tokens={tokens} />
    </div>
  );
}
