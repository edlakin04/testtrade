import { MOCK_TOKEN_BY_MINT } from "@/lib/mock/tokens";
import CoinChartMock from "@/components/coin/CoinChartMock";
import SwapMock from "@/components/coin/SwapMock";

export default function CoinPage({ params }: any) {
  const token = MOCK_TOKEN_BY_MINT[params.mint];

  if (!token) {
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Coin not found</h1>
            <p className="mono">{params.mint}</p>
          </div>
        </div>
        <div className="panel">This is mock mode. Use a mint from the feed list.</div>
      </>
    );
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>
            {token.symbol} <span className="mono">{token.mint}</span>
          </h1>
          <p>{token.name}</p>
        </div>
        <span className="badge">{token.kind === "verified" ? "Verified dev" : "Filtered"}</span>
      </div>

      <div className="grid-2">
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

      <div className="panel">
        <h3>Stats</h3>
        <div className="kv">
          <div className="k">Price</div><div>{token.price}</div>
          <div className="k">Market cap</div><div>{token.mcap}</div>
          <div className="k">Liquidity</div><div>{token.liquidity}</div>
          <div className="k">24h vol</div><div>{token.vol24h}</div>
          <div className="k">Age</div><div>{token.age}</div>
          <div className="k">{token.kind === "verified" ? "Dev" : "Creator"}</div>
          <div className="mono">
            {token.kind === "verified" ? token.devHandle : token.creatorWallet}
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="panel">
        <h3>Comments (mock)</h3>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          Comments will appear here in later chunks (with “must own token” + limits).
        </div>
      </div>
    </>
  );
}
