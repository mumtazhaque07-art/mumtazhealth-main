export const ADMIN_EMAILS = [
  "admin@holistic-wellness.com",
  "mumtaz@mumtazhealth.com",
  "mumtazhaque07@gmail.com",
] as const;

export type SubscriptionRow = {
  tier?: string | null;
  status?: string | null;
  current_period_end?: string | null;
};

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email);
}

const PREMIUM_STATUSES = new Set(["active", "trialing", "canceling"]);

export function evaluatePremium(
  sub: SubscriptionRow | null | undefined,
  now = new Date()
): boolean {
  if (!sub || sub.tier !== "premium") return false;
  if (!PREMIUM_STATUSES.has(sub.status ?? "")) return false;
  if (sub.current_period_end && new Date(sub.current_period_end) <= now) {
    return false;
  }
  return true;
}
