import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { shouldPollInvoice, validateConfigEnvVars, validateInvoiceCreationResult } from "../hooks/useInvoices";
import { validateConfig } from "../lib/config";

describe("Regression: Polling lifecycle and config validation (PR #176)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Polling only when connected", () => {
    it("does not start polling interval when not connected using shouldPollInvoice", () => {
      const connected = false;
      expect(shouldPollInvoice(connected)).toBe(false);
    });

    it("allows polling interval when connected using shouldPollInvoice", () => {
      const connected = true;
      expect(shouldPollInvoice(connected)).toBe(true);
    });
  });

  describe("Config validation logic", () => {
    it("reports all three env vars as missing when none are set via validateConfig", () => {
      const originalInvoice = process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID;
      const originalPool = process.env.NEXT_PUBLIC_POOL_CONTRACT_ID;
      const originalRegistry = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID;

      delete process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID;
      delete process.env.NEXT_PUBLIC_POOL_CONTRACT_ID;
      delete process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID;

      try {
        const missing = validateConfigEnvVars();
      expect(missing.length).toBe(3);
      } finally {
        if (originalInvoice) process.env.NEXT_PUBLIC_INVOICE_CONTRACT_ID = originalInvoice;
        if (originalPool) process.env.NEXT_PUBLIC_POOL_CONTRACT_ID = originalPool;
        if (originalRegistry) process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ID = originalRegistry;
      }
    });
  });

  describe("Invoice creation validation", () => {
    it("throws error when invoice_id is missing from creation result using validateInvoiceCreationResult", () => {
      const res: any = { transaction_hash: "0xabc" };
      expect(() => validateInvoiceCreationResult(res)).toThrow("valid invoice ID");
    });

    it("throws error when transaction_hash is missing from creation result using validateInvoiceCreationResult", () => {
      const res: any = { invoice_id: "inv123" };
      expect(() => validateInvoiceCreationResult(res)).toThrow("transaction hash");
    });

    it("passes validation when both invoice_id and transaction_hash are present", () => {
      const res: any = { invoice_id: "inv123", transaction_hash: "0xabc" };
      expect(() => validateInvoiceCreationResult(res)).not.toThrow();
    });
  });
});
