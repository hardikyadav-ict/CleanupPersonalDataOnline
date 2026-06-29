import { chromium, Browser, Page, BrowserContext } from "playwright";
import { BrokerSchema, FormStep } from "../../src/types";
import { CaptchaSolver, captchaSolver } from "./captcha-solver";
import { ProxyManager, proxyManager } from "./proxy-manager";
import { generateFingerprint, BrowserFingerprint } from "./fingerprint";
import { VisionAgent, visionAgent } from "./vision-agent";
import { brokerSchemaLoader } from "./schema-loader";

export interface ExecutionResult {
  success: boolean;
  screenshotPaths: string[];
  confirmationToken?: string;
  errorMessage?: string;
  fallbackUsed: boolean;
  durationMs: number;
}

export class BrokerExecutor {
  private browser: Browser | null = null;
  private captchaSolver: CaptchaSolver;
  private visionAgent: VisionAgent;

  constructor() {
    this.captchaSolver = captchaSolver;
    this.visionAgent = visionAgent;
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    });
  }

  async execute(
    brokerSlug: string,
    userData: {
      email?: string;
      firstName?: string;
      lastName?: string;
      addresses?: Array<{ street: string; city: string; state: string; zipCode: string }>;
      phones?: Array<{ number: string }>;
    }
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const schema = brokerSchemaLoader.load(brokerSlug);
    if (!schema) {
      return { success: false, screenshotPaths: [], errorMessage: `Schema not found for ${brokerSlug}`, fallbackUsed: false, durationMs: 0 };
    }

    if (!this.browser) await this.initialize();

    const fingerprint = generateFingerprint(schema.proxy.preferred_country);
    const proxy = schema.proxy.required ? proxyManager.getProxy(schema.proxy.preferred_country) : undefined;

    const context = await this.browser!.newContext({
      userAgent: fingerprint.userAgent,
      viewport: fingerprint.viewport,
      timezoneId: fingerprint.timezone,
      locale: fingerprint.locale,
      proxy: proxy ? { server: proxy.server, username: proxy.username, password: proxy.password } : undefined,
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();
    const screenshotPaths: string[] = [];
    let fellBack = false;

    try {
      for (const step of schema.removal.steps) {
        try {
          await this.executeStep(page, step, userData, schema);
        } catch (stepError: any) {
          // Layer 1 failed, try Layer 2 (vision agent)
          fellBack = true;
          const screenshot = await page.screenshot({ fullPage: true });
          const base64 = screenshot.toString("base64");

          const visionActions = await this.visionAgent.analyzePage(
            base64,
            `Execute step: ${step.description || step.action}`
          );

          if (visionActions.length === 0) {
            throw new Error(`Step ${step.id} failed and vision fallback could not recover`);
          }
        }

        if (step.screenshot_on_submit) {
          const screenshot = await page.screenshot({ fullPage: true, path: `/tmp/${brokerSlug}-${step.id}.png` });
          screenshotPaths.push(`/tmp/${brokerSlug}-${step.id}.png`);
        }
      }

      // Check for confirmation on page
      const pageContent = await page.content();
      const confirmationFound = schema.removal.confirmation.on_page_indicators?.some(
        (indicator) => pageContent.includes(indicator)
      );

      return {
        success: true,
        screenshotPaths,
        fallbackUsed: fellBack,
        durationMs: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        success: false,
        screenshotPaths,
        errorMessage: error.message,
        fallbackUsed: fellBack,
        durationMs: Date.now() - startTime,
      };
    } finally {
      await context.close();
    }
  }

  private async executeStep(
    page: Page,
    step: FormStep,
    userData: any,
    schema: BrokerSchema
  ): Promise<void> {
    const resolveValue = (ref?: string): string | undefined => {
      if (!ref) return undefined;
      const match = ref.match(/{{user\.(.+)}}/);
      if (match) {
        const keys = match[1].split(".");
        let val = userData;
        for (const key of keys) {
          val = val?.[key];
        }
        return val?.toString();
      }
      return step.value;
    };

    switch (step.action) {
      case "goto":
        await page.goto(step.url!, { waitUntil: (step.wait_until as any) || "networkidle", timeout: step.timeout_ms || 30000 });
        break;

      case "fill":
        if (step.selector) {
          try {
            await page.fill(step.selector, resolveValue(step.value_ref) || "");
          } catch {
            // Fallback: try accessibility tree
            const snapshot = await (page as any).accessibility.snapshot();
            if (snapshot) {
              const findNode = (node: any): any => {
                if (node.role === "textbox" && node.name?.toLowerCase().includes(step.selector?.toLowerCase() || "")) return node;
                if (node.children) {
                  for (const child of node.children) {
                    const found = findNode(child);
                    if (found) return found;
                  }
                }
                return null;
              };
              const node = findNode(snapshot);
              if (node?.chromeInternalId) {
                await page.locator(`[ref=${node.chromeInternalId}]`).fill(resolveValue(step.value_ref) || "");
              }
            }
          }
        }
        break;

      case "click":
        if (step.selector) {
          await page.click(step.selector);
          if (step.wait_for_navigation) {
            await page.waitForLoadState("networkidle");
          }
        }
        break;

      case "select_option":
        if (step.selector) {
          await page.selectOption(step.selector, resolveValue(step.value_ref) || "");
        }
        break;

      case "captcha":
        if (schema.removal.requires_captcha) {
          const siteKey = await page.getAttribute(step.site_key_selector || "[data-sitekey]", "data-sitekey")
            || await page.evaluate(() => {
              const el = document.querySelector("[data-sitekey]");
              return el?.getAttribute("data-sitekey") || "";
            });

          if (siteKey) {
            const solution = await this.captchaSolver.solve(page.url(), siteKey, step.captcha_type || "recaptcha_v2");
            await page.evaluate((token) => {
              const el = document.getElementById("g-recaptcha-response");
              if (el) (el as HTMLInputElement).value = token;
              // Trigger callback
              const client = (window as any).___grecaptcha_cfg?.clients?.[0];
              if (client?.callback) client.callback(token);
            }, solution.token);
          }
        }
        break;

      case "wait":
        if (step.selector) {
          await page.waitForSelector(step.selector, { timeout: step.timeout_ms || 10000 });
        } else {
          await new Promise((r) => setTimeout(r, step.timeout_ms || 1000));
        }
        break;

      case "screenshot":
        break; // handled at step level

      case "script":
        if (step.value) {
          await page.evaluate(step.value);
        }
        break;
    }
  }

  async destroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const brokerExecutor = new BrokerExecutor();
