import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/db/supabaseServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") || "filtered") as "filtered" | "verified";

  if (type !== "filtered" && type !== "verified") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const supabase = supabaseServer();

  // Get tokens and latest snapshot for each token (simple approach)
  const { data: tokens, error: tokenErr } = await supabase
    .from("tokens")
    .select("mint, kind, name, symbol, creator_wallet, dev_handle, created_at")
    .eq("kind", type)
    .order("created_at", { ascending: false })
    .limit(100);

  if (tokenErr) {
    return NextResponse.json({ error: tokenErr.message }, { status: 500 });
  }

  const mints = (tokens || []).map((t) => t.mint);
  if (mints.length === 0) return NextResponse.json({ tokens: [] });

  const { data: snaps, error: snapErr } = await supabase
    .from("token_snapshots")
    .select("mint, price, mcap, liquidity, vol24h, age, created_at")
    .in("mint", mints)
    .order("created_at", { ascending: false });

  if (snapErr) {
    return NextResponse.json({ error: snapErr.message }, { status: 500 });
  }

  // pick latest snapshot per mint
  const latestByMint = new Map<string, any>();
  for (const s of snaps || []) {
    if (!latestByMint.has(s.mint)) latestByMint.set(s.mint, s);
  }

  const out = (tokens || []).map((t) => {
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

  return NextResponse.json({ tokens: out });
}
