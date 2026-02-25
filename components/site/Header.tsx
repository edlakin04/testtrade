import WalletButton from "@/components/wallet/WalletButton";

export default function Header() {
  return (
    <div className="header-inner">
      <div className="brand">AuthSwap</div>
      <WalletButton />
    </div>
  );
}
