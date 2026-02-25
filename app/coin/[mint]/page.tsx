import CoinChartMock from "@/components/coin/CoinChartMock";
import SwapMock from "@/components/coin/SwapMock";
import { supabaseServer } from "@/lib/db/supabaseServer";

export default async function CoinPage({ params }: any) {
  const mint = params?.mint as string;

  const supabase = supabaseServer();

  // Get token row
  const { data: token, error: tokenErr } = await supabase
    .from("tokens")
    .select("mint, kind, name, symbol, creator_wallet, dev_handle, created_at")
    .eq("mint", mint)
    .maybeSingle();

  if (tokenErr) {
    return (
      <div className="panel">
        Error loading token: <span className="mono">{tokenErr.message}</span>
      </div>
    );
  }

  if (!token) {
    return (
      <>
        <div className="panel">
          <strong>Coin not found</strong>
          <div className="mono" style={{ marginTop: 8 }}>{mint}</div>
          <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 13 }}>
            This mint isn’t in the <span className="mono">tokens</span> table.
          </div>
        </div>
      </>
    );
  }

  // Get latest snapshot for this mint
  const { data: snap, error: snapErr } = await supabase
    .from("token_snapshots")
    .select("price, mcap, liquidity, vol24h, age, created_at")
    .eq("mint", mint)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (snapErr) {
    return (
      <div className="panel">
        Error loading snapshot: <span className="mono">{snapErr.message}</span>
      </div>
    );
  }

  const price = snap?.price ?? "—";
  const mcap = snap?.mcap ?? "—";
  const liquidity = snap?.liquidity ?? "—";
  const vol24h = snap?.vol24h ?? "—";
  const age = snap?.age ?? "—";

  return (
    <>
      <div style={{ padding: "18px 24px 10px" }}>
        <h1 style={{ margin: 0, fontSize: 18, letterSpacing: "-0.03em" }}>
          {token.symbol} <span className="mono">{token.mint}</span>
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--muted)" }}>
          {token.name}
        </p>
      </div>

      <div className="grid-2" style={{ padding: "0 24px" }}>
        <div className="panel">
          <h3>Chart</h3>
          <CoinChartMock />
        </div>
        <div className="panel">
          <h3>Swap</h3>
          <SwapMock baseSymbol={token.symbol} />
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="panel" style={{ margin: "0 24px" }}>
        <h3>Stats</h3>
        <div className="kv">
          <div className="k">Price</div><div>{price}</div>
          <div className="k">Market cap</div><div>{mcap}</div>
          <div className="k">Liquidity</div><div>{liquidity}</div>
          <div className="k">24h vol</div><div>{vol24h}</div>
          <div className="k">Age</div><div>{age}</div>

          <div className="k">Kind</div><div>{token.kind}</div>

          <div className="k">Creator</div>
          <div className="mono">
            {token.kind === "verified"
              ? `@${token.dev_handle ?? "—"}`
              : token.creator_wallet ?? "—"}
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="panel" style={{ margin: "0 24px" }}>
        <h3>Comments</h3>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          Comments will be wired up in later chunks (must own token + limits).
        </div>
      </div>
    </>
  );
}
