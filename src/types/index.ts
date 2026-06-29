export type BrokerSchema = {
  metadata: {
    id: string;
    name: string;
    website: string;
    type: "public" | "private";
    jurisdiction: string;
    category: string;
    active: boolean;
  };
  legal: {
    law_basis: string;
    response_deadline_days: number;
    suppression_renewal_days: number;
    identity_verification: string;
  };
  removal: {
    method: "form" | "email" | "api" | "postal";
    entry_url: string;
    requires_captcha: boolean;
    captcha_type: string;
    requires_account: boolean;
    steps: FormStep[];
    confirmation: ConfirmationConfig;
    error_detection: ErrorDetection;
  };
  rate_limiting: {
    max_requests_per_hour: number;
    min_delay_between_requests_ms: number;
    cooldown_after_failure_minutes: number;
  };
  proxy: {
    required: boolean;
    preferred_country: string;
    sticky_session: boolean;
    avoid_datacenter: boolean;
  };
  schedule: {
    initial_removal: string;
    recurring_interval_days: number;
    recurring_jitter_minutes: number;
  };
};

export type FormStep = {
  id: string;
  action:
    | "goto"
    | "fill"
    | "click"
    | "select_option"
    | "captcha"
    | "wait"
    | "screenshot"
    | "script"
    | "extract"
    | "conditional";
  selector?: string;
  url?: string;
  value_ref?: string;
  value?: string;
  wait_until?: string;
  timeout_ms?: number;
  wait_for_navigation?: boolean;
  screenshot_on_submit?: boolean;
  captcha_type?: string;
  site_key_selector?: string;
  inject_selector?: string;
  description?: string;
  sub_steps?: FormStep[];
  condition?: string;
};

export type ConfirmationConfig = {
  type: "on_page" | "email" | "both";
  expected_subject_regex?: string;
  expected_sender_regex?: string;
  token_extraction?: {
    method: "regex" | "llm_parse";
    regex?: string;
  };
  on_page_indicators?: string[];
};

export type ErrorDetection = {
  retryable_selectors?: string[];
  non_retryable_selectors?: string[];
  max_retries: number;
  retry_backoff_ms: number[];
};

export type PlanConfig = {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyPriceId: string;
  annualPriceId: string;
  description: string;
  features: { text: string; included: boolean }[];
  recommended?: boolean;
  maxMembers?: number;
  hasCustomRemovals?: boolean;
  hasPhoneSupport?: boolean;
};

export interface ScanResult {
  brokerId: string;
  brokerName: string;
  found: boolean;
  profileUrl?: string;
  dataPoints?: string[];
}
