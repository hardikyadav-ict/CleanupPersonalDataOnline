export interface BrowserFingerprint {
  userAgent: string;
  viewport: { width: number; height: number };
  timezone: string;
  locale: string;
  geolocation?: { latitude: number; longitude: number };
}

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
];

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
];

export function generateFingerprint(preferredCountry?: string): BrowserFingerprint {
  const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
  const tz = timezones[Math.floor(Math.random() * timezones.length)];

  return {
    userAgent: ua,
    viewport: {
      width: 1280 + Math.floor(Math.random() * 200),
      height: 720 + Math.floor(Math.random() * 200),
    },
    timezone: tz,
    locale: preferredCountry === "US" ? "en-US" : "en-GB",
  };
}
