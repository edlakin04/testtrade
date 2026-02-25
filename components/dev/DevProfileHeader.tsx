import type { DevProfile } from "@/types";

export default function DevProfileHeader({ dev }: { dev: DevProfile }) {
  return (
    <div className="panel">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 14,
          alignItems: "start"
        }}
      >
        {/* Left: info */}
        <div>
          <div className="kv">
            <div className="k">Joined</div><div>{dev.joined}</div>
            <div className="k">Wallet</div><div className="mono">{dev.wallet}</div>
            <div className="k">Twitter/X</div><div>{dev.twitter}</div>
            <div className="k">Telegram</div><div>{dev.telegram}</div>
            <div className="k">Verification</div>
            <div style={{ color: "var(--muted)" }}>
              Check socials for code: <span className="mono">{dev.verificationCode}</span>
            </div>
          </div>

          <div style={{ height: 10 }} />

          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            {dev.bio}
          </div>
        </div>

        {/* Right: big photo */}
        <div
          style={{
            border: "1px solid rgba(0,0,0,0.10)",
            height: 220,
            background: "linear-gradient(180deg, #fff 0%, #f6f6f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
            fontSize: 13
          }}
        >
          Dev photo (mock)
        </div>
      </div>
    </div>
  );
}
