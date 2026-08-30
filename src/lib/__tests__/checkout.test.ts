import { describe, it, expect } from "vitest";
import { checkoutRequestBody, checkoutUrlFromResponse } from "../checkout";

describe("checkoutRequestBody", () => {
  it("sends monthly tierId matching the edge function", () => {
    expect(checkoutRequestBody("monthly", "https://mumtazhealth.app")).toEqual({
      tierId: "monthly",
      successUrl: "https://mumtazhealth.app/settings?checkout=success",
      cancelUrl: "https://mumtazhealth.app/upgrade?checkout=cancelled",
    });
  });

  it("sends annual founding-member tierId", () => {
    expect(checkoutRequestBody("annual", "http://localhost:8080").tierId).toBe("annual");
  });
});

describe("checkoutUrlFromResponse", () => {
  it("accepts a Stripe https URL", () => {
    expect(checkoutUrlFromResponse({ url: "https://checkout.stripe.com/c/pay/cs_test_123" })).toBe(
      "https://checkout.stripe.com/c/pay/cs_test_123"
    );
  });

  it("rejects missing or non-https URLs", () => {
    expect(checkoutUrlFromResponse(null)).toBe(null);
    expect(checkoutUrlFromResponse({ url: "http://evil.example/phish" })).toBe(null);
    expect(checkoutUrlFromResponse({ error: "not configured" })).toBe(null);
  });
});
