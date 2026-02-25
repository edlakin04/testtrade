import type { TokenListItem } from "@/types";

export const MOCK_FILTERED_TOKENS: TokenListItem[] = [
  {
    kind: "filtered",
    mint: "Filt11111111111111111111111111111111111111111",
    name: "Filtered Alpha",
    symbol: "FALPHA",
    price: "$0.0031",
    mcap: "$1.2M",
    liquidity: "$210K",
    vol24h: "$480K",
    age: "2h",
    creatorWallet: "9xQeWvG816bUx9EP...mock",
    devHandle: ""
  },
  {
    kind: "filtered",
    mint: "Filt22222222222222222222222222222222222222222",
    name: "Filtered Beta",
    symbol: "FBETA",
    price: "$0.00042",
    mcap: "$640K",
    liquidity: "$95K",
    vol24h: "$210K",
    age: "6h",
    creatorWallet: "H3u8pXkM9qv3...mock",
    devHandle: ""
  }
];

export const MOCK_VERIFIED_TOKENS: TokenListItem[] = [
  {
    kind: "verified",
    mint: "Veri11111111111111111111111111111111111111111",
    name: "Verified One",
    symbol: "VONE",
    price: "$0.012",
    mcap: "$4.8M",
    liquidity: "$530K",
    vol24h: "$1.1M",
    age: "3d",
    creatorWallet: "",
    devHandle: "devmax"
  },
  {
    kind: "verified",
    mint: "Veri22222222222222222222222222222222222222222",
    name: "Verified Two",
    symbol: "VTWO",
    price: "$0.0019",
    mcap: "$980K",
    liquidity: "$140K",
    vol24h: "$320K",
    age: "14h",
    creatorWallet: "",
    devHandle: "devmax"
  }
];

export const MOCK_TOKEN_BY_MINT: Record<string, TokenListItem> = Object.fromEntries(
  [...MOCK_FILTERED_TOKENS, ...MOCK_VERIFIED_TOKENS].map((t) => [t.mint, t])
);
