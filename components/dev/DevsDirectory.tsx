"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DevRow = {
  handle: string;
  wallet: string;
  twitter: string;
  telegram: string;
  verificationCode: string;
  joinedAt: string;
};

export default function DevsDirectory() {
  const [q, setQ] = useState("");
  const [devs, setDevs] = useState<DevRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/devs?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
          signal: controller.signal
        });
        const json = await res.json();
        setDevs(json.devs || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    // small debounce
    const t = setTimeout(load, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q]);

  const subtitle = useMemo(() => {
    if (loading) return "Loading…";
    if (!q) return `${devs.length} devs`;
    return `${devs.length} result${devs.length === 1 ? "" : "s"}`;
  }, [devs.length, loading, q]);

  return (
    <>
      {/* Title + search (kept simple; styling polish later) */}
      <div style={{ padding: "14px 24px 10px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Devs</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{subtitle}</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dev handle…"
            style={{
              width: "100%",
              maxWidth: 520,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--hairline)",
              outline: "none",
              fontSize: 14
            }}
          />
        </div>
      </div>

      {/* Rows */}
      <div className="table-wrap">
        <table>
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>

          <thead>
            <tr>
              <th>Dev</th>
              <th>Wallet</th>
              <th>Twitter</th>
              <th>Telegram</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {devs.map((d) => (
              <tr key={d.handle}>
                <td>
                  <Link href={`/dev/${d.handle}`}>
                    <strong>@{d.handle}</strong>
                  </Link>
                </td>
                <td className="mono">{d.wallet}</td>
                <td>{d.twitter || "—"}</td>
                <td>{d.telegram || "—"}</td>
                <td className="mono">{(d.joinedAt || "").slice(0, 10) || "—"}</td>
              </tr>
            ))}

            {!loading && devs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "16px 24px", color: "var(--muted)" }}>
                  No devs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
