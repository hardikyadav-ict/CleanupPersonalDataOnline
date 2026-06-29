export function getStripeClient(): null {
  return null;
}

export const PLAN_PRICE_IDS: Record<string, { monthly: string; annual: string }> = {
  standard: { monthly: "free", annual: "free" },
  unlimited: { monthly: "free", annual: "free" },
  family: { monthly: "free", annual: "free" },
  family_unlimited: { monthly: "free", annual: "free" },
};

export function getCheckoutUrl(_planId: string): string {
  return "/pricing";
}
