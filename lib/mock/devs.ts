import type { DevProfile } from "@/types";

export const MOCK_DEV_BY_HANDLE: Record<string, DevProfile> = {
  devmax: {
    handle: "devmax",
    joined: "2026-02-01",
    wallet: "7YpQ...mockDevWallet",
    twitter: "@devmax",
    telegram: "t.me/devmax",
    verificationCode: "AUTHSWAP-7K3Q9D",
    bio: "Minimal verified dev profile. Social proof code must be visible on the linked socials."
  }
};
