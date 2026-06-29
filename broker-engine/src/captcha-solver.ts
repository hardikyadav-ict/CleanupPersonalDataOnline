export interface CaptchaSolution {
  token: string;
  provider: string;
  cost: number;
}

export class CaptchaSolver {
  private providers = [
    { name: "capsolver", baseUrl: "https://api.capsolver.com" },
    { name: "anticaptcha", baseUrl: "https://api.anti-captcha.com" },
  ];

  async solve(
    siteUrl: string,
    siteKey: string,
    type: string = "recaptcha_v2"
  ): Promise<CaptchaSolution> {
    const apiKey = process.env.CAPTCHA_API_KEY || "";

    // Default to CapSolver (cost-effective)
    const task = {
      type: type === "recaptcha_v2" ? "ReCaptchaV2TaskProxyless" :
             type === "hcaptcha" ? "HCaptchaTaskProxyless" :
             "ReCaptchaV2TaskProxyless",
      websiteURL: siteUrl,
      websiteKey: siteKey,
    };

    const createRes = await fetch(`${this.providers[0].baseUrl}/createTask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientKey: apiKey, task }),
    });

    const createData = await createRes.json();
    if (createData.errorId) throw new Error(`CAPTCHA error: ${createData.errorDescription}`);

    const taskId = createData.taskId;

    // Poll for result
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const resultRes = await fetch(`${this.providers[0].baseUrl}/getTaskResult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientKey: apiKey, taskId }),
      });

      const resultData = await resultRes.json();
      if (resultData.status === "ready") {
        return { token: resultData.solution.gRecaptchaResponse, provider: this.providers[0].name, cost: 0.0008 };
      }
    }

    throw new Error("CAPTCHA solving timed out");
  }
}

export const captchaSolver = new CaptchaSolver();
