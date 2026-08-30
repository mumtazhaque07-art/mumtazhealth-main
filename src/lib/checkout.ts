export type CheckoutTier = "monthly" | "annual";

export function checkoutRequestBody(tierId: CheckoutTier, origin: string) {
  return {
    tierId,
    successUrl: `${origin}/settings?checkout=success`,
    cancelUrl: `${origin}/upgrade?checkout=cancelled`,
  };
}

export function checkoutUrlFromResponse(
  data: { url?: string | null; error?: string | null } | null | undefined
): string | null {
  const url = data?.url;
  if (typeof url === "string" && url.startsWith("https://")) return url;
  return null;
}
