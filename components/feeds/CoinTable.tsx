import Link from "next/link";
import type { TokenListItem } from "@/types";

export default function CoinTable({ tokens }: { tokens: TokenListItem[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Price</th>
            <th>MCAP</th>
            <th>Liquidity</th>
            <th>24h Vol</th>
            <th>Age</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.mint}>
              <td>
                <Link href={`/coin/${t.mint}`}>
                  <strong>{t.symbol}</strong>{" "}
                  <span style={{ color: "var(--muted)" }}>{t.name}</span>
                </Link>
              </td>
              <td>{t.price}</td>
              <td>{t.mcap}</td>
              <td>{t.liquidity}</td>
              <td>{t.vol24h}</td>
              <td>{t.age}</td>
              <td className="mono">
                {t.kind === "verified" ? (
                  <Link href={`/dev/${t.devHandle}`}>@{t.devHandle}</Link>
                ) : (
                  t.creatorWallet
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
