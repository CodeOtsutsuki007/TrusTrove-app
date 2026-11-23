import { describe, it, expect, beforeEach, vi } from "vitest";
import { validateConfig } from "./config";

describe("validateConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it("returns isConfigured true when all required variables are present and valid", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "testnet";
    process.env.NEXT_PUBLIC_HORIZON_URL = "https://horizon-testnet.stellar.org";
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
    process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID = "CABGWVIZFF62FG67ZGFEP67NEEY4WYTMFURDMFTKKNRDAFPKPOJDTN4C";
    process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH2";
    process.env.NEXT_PUBLIC_POOL_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH3";
    process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4";
    process.env.NEXT_PUBLIC_USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
    process.env.NEXT_PUBLIC_USDC_ASSET_CODE = "USDC";

    const result = validateConfig();
    expect(result.missing).toEqual([]);
    expect(result.invalid).toEqual([]);
    expect(result.isConfigured).toBe(true);
  });

  it("detects missing variables", () => {
    delete process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID;
    const result = validateConfig();
    expect(result.missing).toContain("NEXT_PUBLIC_INVOICE_CONTRACT_ID");
    expect(result.isConfigured).toBe(false);
  });

  it("detects invalid contract IDs", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "testnet";
    process.env.NEXT_PUBLIC_HORIZON_URL = "https://horizon-testnet.stellar.org";
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
    process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID = "CABGWVIZFF62FG67ZGFEP67NEEY4WYTMFURDMFTKKNRDAFPKPOJDTN4C";
    process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID = "invalid-id";
    process.env.NEXT_PUBLIC_POOL_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH3";
    process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4";
    process.env.NEXT_PUBLIC_USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
    process.env.NEXT_PUBLIC_USDC_ASSET_CODE = "USDC";

    const result = validateConfig();
    expect(result.invalid).toContain("NEXT_PUBLIC_INVOICE_CONTRACT_ID");
    expect(result.isConfigured).toBe(false);
  });

  it("detects network mismatch (mainnet network with testnet passphrase)", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "mainnet";
    process.env.NEXT_PUBLIC_HORIZON_URL = "https://horizon.stellar.org";
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL = "https://soroban.stellar.org";
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
    process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID = "CABGWVIZFF62FG67ZGFEP67NEEY4WYTMFURDMFTKKNRDAFPKPOJDTN4C";
    process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH2";
    process.env.NEXT_PUBLIC_POOL_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH3";
    process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4";
    process.env.NEXT_PUBLIC_USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
    process.env.NEXT_PUBLIC_USDC_ASSET_CODE = "USDC";

    const result = validateConfig();
    expect(result.invalid).toContain("NEXT_PUBLIC_STELLAR_NETWORK");
    expect(result.isConfigured).toBe(false);
  });
});
