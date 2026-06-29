import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY environment variable is required");
  }
  return new Stripe(key, {
    apiVersion: "2025-03-31.basil" as any,
    typescript: true,
  });
}

let _stripe: Stripe | null = null;
export function getStripeClient(): Stripe {
  if (!_stripe) _stripe = getStripe();
  return _stripe;
}

export const PLAN_PRICE_IDS: Record<string, { monthly: string; annual: string }> = {
  STANDARD: {
    monthly: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID ?? "",
    annual: process.env.STRIPE_STANDARD_ANNUAL_PRICE_ID ?? "",
  },
  UNLIMITED: {
    monthly: process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID ?? "",
    annual: process.env.STRIPE_UNLIMITED_ANNUAL_PRICE_ID ?? "",
  },
  FAMILY: {
    monthly: process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID ?? "",
    annual: process.env.STRIPE_FAMILY_ANNUAL_PRICE_ID ?? "",
  },
  FAMILY_UNLIMITED: {
    monthly: process.env.STRIPE_FAMILY_UNLIMITED_MONTHLY_PRICE_ID ?? "",
    annual: process.env.STRIPE_FAMILY_UNLIMITED_ANNUAL_PRICE_ID ?? "",
  },
};

export function getPlanPriceId(planId: string, isAnnual: boolean): string {
  const [base] = planId.split("_");
  const plan = PLAN_PRICE_IDS[base as keyof typeof PLAN_PRICE_IDS];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);
  return isAnnual ? plan.annual : plan.monthly;
}
