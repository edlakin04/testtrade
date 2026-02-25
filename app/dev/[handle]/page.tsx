import CoinTable from "@/components/feeds/CoinTable";
import { supabaseServer } from "@/lib/db/supabaseServer";

export default async function DevProfilePage({ params }: any) {
  const handle = params?.handle as string;

  const supabase = supabaseServer();

  // 1) Load dev profile
  const { data: dev, error: devErr } = await supabase
    .from("dev_profiles")
    .select("handle, wallet, twitter, telegram, verification_code, joined_at")
    .eq("handle", handle)
    .maybeSingle();

  if (devErr) {
    return (
      <div className="panel">
        Error loading dev: <span className="mono">{devErr.message}</span>
      </div>
    );
  }

  if (!dev) {
    return (
      <div className="panel">
        <strong>Dev not found</strong>
        <div className="mono" style={{ marginTop: 8 }}>@{handle}</div>
        <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 13 }}>
          This handle isn’t in <span className="mono">dev_profiles</span>.
        </div>
      </div>
    );
  }

  // 2) Load dev's submitted tokens (verified)
  const { data: tokens, error: tokenErr } = await supabase
    .from("tokens")
    .select("mint, kind, name, symbol, creator_wallet, dev_handle, created_at")
    .eq("kind", "verified")
    .eq("dev_handle", handle)
    .order("created_at", { ascending: false })
    .limit(200);

  if (tokenErr) {
    return (
      <div className="panel">
        Error loading dev coins: <span className="mono">{tokenErr.message}</span>
      </div>
    );
  }

  const mints = (tokens || []).map((t) => t.mint);

  // 3) Load latest snapshots for those mints
  let latestByMint = new Map<string, any>();
  if (mints.length > 0) {
    const { data: snaps, error: snapErr } = await supabase
      .from("token_snapshots")
      .select("mint, price, mcap, liquidity, vol24h, age, created_at")
      .in("mint", mints)
      .order("created_at", { ascending: false });

    if (snapErr) {
      return (
        <div className="panel">
          Error loading snapshots: <span className="mono">{snapErr.message}</span>
        </div>
      );
    }

    for (const s of snaps || []) {
      if (!latestByMint.has(s.mint)) latestByMint.set(s.mint, s);
    }
  }

  // Shape into TokenListItem for the table component
  const tableTokens = (tokens || []).map((t) => {
    const snap = latestByMint.get(t.mint);
    return {
      kind: t.kind,
      mint: t.mint,
      name: t.name,
      symbol: t.symbol,
      price: snap?.price ?? "—",
      mcap: snap?.mcap ?? "—",
      liquidity: snap?.liquidity ?? "—",
      vol24h: snap?.vol24h ?? "—",
      age: snap?.age ?? "—",
      creatorWallet: t.creator_wallet ?? "—",
      devHandle: t.dev_handle ?? "",
    };
  });

  return (
    <div className="fullbleed">
      {/* Header block */}
      <div style={{ padding: "16px 24px 10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>
              @{dev.handle}
            </div>
            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
              Joined: <span className="mono">{String(dev.joined_at).slice(0, 10)}</span>
            </div>
          </div>

          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Verification code: <span className="mono">{dev.verification_code}</span>
          </div>
        </div>
      </div>

      {/* Info row */}
      <div style={{ padding: "0 24px 14px" }}>
        <div className="panel">
          <div className="kv">
            <div className="k">Wallet</div>
            <div className="mono">{dev.wallet}</div>

            <div className="k">Twitter</div>
            <div>{dev.twitter || "—"}</div>

            <div className="k">Telegram</div>
            <div>{dev.telegram || "—"}</div>
          </div>
        </div>
      </div>

      {/* Coins table */}
      <div style={{ padding: "0 0 18px" }}>
        <CoinTable tokens={tableTokens} />
      </div>
    </div>
  );
}
