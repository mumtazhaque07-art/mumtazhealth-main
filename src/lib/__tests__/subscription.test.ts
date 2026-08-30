import { describe, it, expect } from "vitest";
import { evaluatePremium, isAdminEmail } from "../subscription";

describe("isAdminEmail", () => {
  it("treats the founder Gmail as admin", () => {
    expect(isAdminEmail("mumtazhaque07@gmail.com")).toBe(true);
  });

  it("rejects empty and unknown emails", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail("beta@example.com")).toBe(false);
  });
});

describe("evaluatePremium", () => {
  const future = "2099-01-01T00:00:00.000Z";
  const past = "2020-01-01T00:00:00.000Z";

  it("is false with no row (Taste Journey)", () => {
    expect(evaluatePremium(null)).toBe(false);
  });

  it("is false for free tier", () => {
    expect(evaluatePremium({ tier: "free", status: "active" })).toBe(false);
  });

  it("is true for active premium", () => {
    expect(evaluatePremium({ tier: "premium", status: "active", current_period_end: future })).toBe(true);
  });

  it("is true for trialing premium", () => {
    expect(evaluatePremium({ tier: "premium", status: "trialing" })).toBe(true);
  });

  it("is true while canceling if the period has not ended", () => {
    expect(evaluatePremium({ tier: "premium", status: "canceling", current_period_end: future })).toBe(true);
  });

  it("is false when the period has ended", () => {
    expect(evaluatePremium({ tier: "premium", status: "active", current_period_end: past })).toBe(false);
  });

  it("is false for canceled without remaining period", () => {
    expect(evaluatePremium({ tier: "premium", status: "canceled" })).toBe(false);
  });
});
