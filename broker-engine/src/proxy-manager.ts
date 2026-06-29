export interface ProxyConfig {
  server: string;
  username?: string;
  password?: string;
}

export class ProxyManager {
  private currentIndex = 0;
  private providers = [
    { name: "smartproxy", baseUrl: "http://customer-{user}:{pass}@gate.smartproxy.com:10000" },
    { name: "brightdata", baseUrl: "http://customer-{user}:{pass}@brd.superproxy.io:22225" },
    { name: "iproyal", baseUrl: "http://customer-{user}:{pass}@geo.iproyal.com:12321" },
  ];

  getProxy(preferredCountry?: string): ProxyConfig {
    const provider = this.providers[this.currentIndex % this.providers.length];
    this.currentIndex++;

    const username = process.env[`PROXY_${provider.name.toUpperCase()}_USER`] || "";
    const password = process.env[`PROXY_${provider.name.toUpperCase()}_PASS`] || "";
    const countryParam = preferredCountry ? `-country-${preferredCountry}` : "";

    return {
      server: provider.baseUrl
        .replace("{user}", `${username}${countryParam}`)
        .replace("{pass}", password),
      username: `${username}${countryParam}`,
      password,
    };
  }

  getRotatingProxy(): ProxyConfig {
    return {
      server: `http://${process.env.PROXY_ROTATING_USER}:${process.env.PROXY_ROTATING_PASS}@${process.env.PROXY_ROTATING_ENDPOINT}`,
    };
  }
}

export const proxyManager = new ProxyManager();
