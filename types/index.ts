export type TokenKind = "filtered" | "verified";

export type TokenListItem = {
  kind: TokenKind;
  mint: string;
  name: string;
  symbol: string;
  price: string;
  mcap: string;
  liquidity: string;
  vol24h: string;
  age: string;
  creatorWallet: string; // for filtered
  devHandle: string; // for verified
};

export type DevProfile = {
  handle: string;
  joined: string;
  wallet: string;
  twitter: string;
  telegram: string;
  verificationCode: string;
  bio: string;
};
