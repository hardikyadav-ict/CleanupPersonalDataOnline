import { ConfirmationExtraction } from "./inbound-parser";

export class LLMTokenExtractor {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }

  async extractConfirmation(emailBody: string): Promise<ConfirmationExtraction> {
    const prompt = `You are a confirmation email parser for a data removal service.
Extract opt-out confirmation details from the email body below.

Rules:
- Look for verification links (URLs containing confirm, verify, validate, optout)
- Look for confirmation codes (6-12 character alphanumeric strings labeled as code/token/ID)
- Ignore unsubscribe links and promotional content
- Return JSON null for any field not found

Email body:
${emailBody.slice(0, 3000)}

Return format (JSON only):
{
  "confirmation_url": "https://..." or null,
  "confirmation_code": "ABC123" or null,
  "reference_number": "REF-..." or null,
  "expires_at": "ISO8601 datetime" or null,
  "confidence": 0.0-1.0,
  "summary": "Brief description of what was found"
}`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You extract confirmation details from emails. Return ONLY valid JSON." },
            { role: "user", content: prompt },
          ],
          max_tokens: 300,
          temperature: 0.1,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(content.replace(/```json/g, "").replace(/```/g, "").trim());

      return {
        confirmationUrl: parsed.confirmation_url || undefined,
        confirmationCode: parsed.confirmation_code || undefined,
        referenceNumber: parsed.reference_number || undefined,
        expiresAt: parsed.expires_at || undefined,
        confidence: parsed.confidence || 0,
        summary: parsed.summary || "No confirmation details found",
      };
    } catch (error) {
      console.error("LLM extraction error:", error);
      return {
        confidence: 0,
        summary: "LLM extraction failed",
      };
    }
  }

  async extractUsingRegex(emailBody: string): Promise<ConfirmationExtraction | null> {
    // Fallback: regex-based extraction
    const urlRegex = /https?:\/\/[^\s<>"']+\/(?:confirm|verify|validate|optout)\/[^\s<>"']+/gi;
    const codeRegex = /(?:confirmation\s*code|verification\s*code|token|otp)[:\s]*([A-Za-z0-9]{6,12})/gi;

    const urls = [...emailBody.matchAll(urlRegex)].map((m) => m[0]);
    const codes = [...emailBody.matchAll(codeRegex)].map((m) => m[1]);

    if (urls.length > 0 || codes.length > 0) {
      return {
        confirmationUrl: urls[0],
        confirmationCode: codes[0],
        confidence: 0.7,
        summary: "Extracted via regex fallback",
      };
    }

    return null;
  }
}

export const llmExtractor = new LLMTokenExtractor();
