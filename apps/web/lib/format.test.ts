import { describe, it, expect } from "vitest";
import { truncateAddress } from "./format";

describe("truncateAddress", () => {
  it("returns empty string for falsy input", () => {
    expect(truncateAddress("")).toBe("");
    expect(truncateAddress(undefined as unknown as string)).toBe("");
    expect(truncateAddress(null as unknown as string)).toBe("");
  });

  it("returns original string unchanged when length is 10 or shorter", () => {
    expect(truncateAddress("GABCD")).toBe("GABCD");
    expect(truncateAddress("1234567890")).toBe("1234567890");
    expect(truncateAddress("A")).toBe("A");
  });

  it("truncates strings longer than 10 characters", () => {
    expect(truncateAddress("12345678901")).toBe("123456...8901");
  });

  it("correctly truncates a 56-character Stellar address", () => {
    const stellarAddr = "GBBD47IF6LZ72Y2RX6ZXQZXQZXQZXQZXQZXQZXQZXQZXQZXQZXQZXQZX";
    const result = truncateAddress(stellarAddr);
    expect(result).toBe("GBBD47...ZXQZX");
    expect(result.length).toBeLessThan(stellarAddr.length);
  });
});
