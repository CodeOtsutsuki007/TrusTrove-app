import { describe, it, expect } from "vitest";
import { isValidBuyerAddress } from "../lib/validation";

describe("Regression: Buyer address validation wrapper (issue #130)", () => {
  it("accepts a valid Stellar Ed25519 public key via app validation wrapper", () => {
    const validKey = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    const result = isValidBuyerAddress(validKey);
    expect(result).toBe(true);
  });

  it("rejects an invalid Stellar public key via app validation wrapper", () => {
    const fakeKey = "G12345678901234567890123456789012345678901234567890123456";
    const result = isValidBuyerAddress(fakeKey);
    expect(result).toBe(false);
  });
});
