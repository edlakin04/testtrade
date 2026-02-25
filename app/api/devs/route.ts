import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/db/supabaseServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  const supabase = supabaseServer();

  // Basic query: list dev profiles. If q provided, filter by handle (ILIKE).
  // "Top devs" sort for now = newest first (we'll later replace with score/volume/etc).
  let query = supabase
    .from("dev_profiles")
    .select("handle, wallet, twitter, telegram, verification_code, joined_at")
    .order("joined_at", { ascending: false })
    .limit(100);

  if (q.length > 0) {
    query = query.ilike("handle", `%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return in a UI-friendly shape
  const devs = (data || []).map((d) => ({
    handle: d.handle,
    wallet: d.wallet,
    twitter: d.twitter ?? "",
    telegram: d.telegram ?? "",
    verificationCode: d.verification_code,
    joinedAt: d.joined_at
  }));

  return NextResponse.json({ devs });
}
