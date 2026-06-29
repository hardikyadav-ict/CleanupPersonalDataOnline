import { PlanConfig } from "@/types";

export const PLANS: PlanConfig[] = [
  {
    id: "STANDARD",
    name: "Standard",
    monthlyPrice: 15.98,
    annualPrice: 7.99,
    monthlyPriceId: "price_standard_monthly",
    annualPriceId: "price_standard_annual",
    description: "Stay off data broker sites, hassle-free",
    recommended: false,
    features: [
      { text: "420+ data broker sites covered", included: true },
      { text: "Removal of multiple emails, addresses & phone numbers", included: true },
      { text: "Recurring removals", included: true },
      { text: "Custom removal requests (2,000+ additional sites)", included: false },
      { text: "Live phone support", included: false },
      { text: "Up to 5 members", included: false },
    ],
  },
  {
    id: "UNLIMITED",
    name: "Unlimited",
    monthlyPrice: 29.99,
    annualPrice: 14.99,
    monthlyPriceId: "price_unlimited_monthly",
    annualPriceId: "price_unlimited_annual",
    description: "Remove your personal data, wherever it's exposed",
    recommended: true,
    features: [
      { text: "420+ data broker sites covered", included: true },
      { text: "Removal of multiple emails, addresses & phone numbers", included: true },
      { text: "Recurring removals", included: true },
      { text: "Custom removal requests (2,000+ additional sites)", included: true },
      { text: "Live phone support", included: true },
      { text: "Up to 5 members", included: false },
    ],
  },
  {
    id: "FAMILY",
    name: "Family",
    monthlyPrice: 31.98,
    annualPrice: 15.99,
    monthlyPriceId: "price_family_monthly",
    annualPriceId: "price_family_annual",
    description: "Add protection to your closest friends and family all in one place",
    recommended: false,
    features: [
      { text: "420+ data broker sites covered", included: true },
      { text: "Removal of multiple emails, addresses & phone numbers", included: true },
      { text: "Recurring removals", included: true },
      { text: "Custom removal requests (2,000+ additional sites)", included: false },
      { text: "Live phone support", included: false },
      { text: "Up to 5 members", included: true },
    ],
  },
  {
    id: "FAMILY_UNLIMITED",
    name: "Family Unlimited",
    monthlyPrice: 45.98,
    annualPrice: 22.99,
    monthlyPriceId: "price_family_unlimited_monthly",
    annualPriceId: "price_family_unlimited_annual",
    description: "Get unlimited data removals for the people you care about",
    recommended: false,
    features: [
      { text: "420+ data broker sites covered", included: true },
      { text: "Removal of multiple emails, addresses & phone numbers", included: true },
      { text: "Recurring removals", included: true },
      { text: "Custom removal requests (2,000+ additional sites)", included: true },
      { text: "Live phone support", included: true },
      { text: "Up to 5 members", included: true },
    ],
  },
];

export const STATS = [
  { value: "245M+", label: "data removal requests completed" },
  { value: "2,420+", label: "sites covered in total" },
  { value: "420+", label: "data brokers covered with automated removals" },
  { value: "2,000+", label: "additional sites covered by Custom Removals" },
];

export const TESTIMONIALS = [
  {
    name: "Philip DeFranco",
    title: "6.5M+ Subscribers",
    image: "/testimonials/philip-defranco.png",
    text: "Whether you're privacy-conscious or just don't like the idea of Joe Shmoe finding where you live or where you work, it just makes sense to take advantage of the service that keeps this information private.",
  },
  {
    name: "Johnny Harris",
    title: "5.3M+ subscribers",
    image: "/testimonials/johnny-harris.png",
    text: "My phone doesn't blow up anymore, my e-mail is under control, and the best part is I get to track the progress.",
  },
  {
    name: "Legal Eagle",
    title: "3.2M+ subscribers",
    image: "/testimonials/legal-eagle.png",
    text: "Not only does Incogni stop marketing efforts but it also reduces your risk of information being part of a data breach or used in identity theft or stalking.",
  },
];
