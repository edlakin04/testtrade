import { MOCK_DEV_BY_HANDLE } from "@/lib/mock/devs";
import { MOCK_VERIFIED_TOKENS } from "@/lib/mock/tokens";
import DevProfileHeader from "@/components/dev/DevProfileHeader";
import CoinTable from "@/components/feeds/CoinTable";

export default function DevProfilePage({ params }: { params: { handle: string } }) {
  const dev = MOCK_DEV_BY_HANDLE[params.handle];

  if (!dev) {
    return (
      <>
        <div className="page-title">
          <div>
            <h1>Dev not found</h1>
            <p className="mono">{params.handle}</p>
          </div>
        </div>
        <div className="panel">This is mock mode. Use a dev handle from the verified tokens list.</div>
      </>
    );
  }

  const devTokens = MOCK_VERIFIED_TOKENS.filter((t) => t.devHandle === dev.handle);

  return (
    <>
      <div className="page-title">
        <div>
          <h1>@{dev.handle}</h1>
          <p>Verified dev profile (mock).</p>
        </div>
        <span className="badge">Verification code required</span>
      </div>

      <DevProfileHeader dev={dev} />

      <div style={{ height: 14 }} />

      <div className="panel">
        <h3>Coins</h3>
        <CoinTable tokens={devTokens} variant="verified" />
      </div>
    </>
  );
}
