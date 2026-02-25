import crypto from "crypto";

export function makeNonce() {
  return crypto.randomBytes(16).toString("hex");
}
