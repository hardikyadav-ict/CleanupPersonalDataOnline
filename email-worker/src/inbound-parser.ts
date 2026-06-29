export interface ParsedEmail {
  from: string;
  to: string;
  subject: string;
  textBody: string;
  htmlBody: string;
  attachments: Array<{
    filename: string;
    contentType: string;
    content: Buffer;
  }>;
  receivedAt: Date;
}

export interface ConfirmationExtraction {
  confirmationUrl?: string;
  confirmationCode?: string;
  referenceNumber?: string;
  expiresAt?: string;
  confidence: number;
  summary: string;
}

export class EmailInboundParser {
  parseSendGridPayload(payload: any): ParsedEmail {
    return {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      textBody: payload.text || "",
      htmlBody: payload.html || "",
      attachments: (payload.attachments || []).map((a: any) => ({
        filename: a.filename || "attachment",
        contentType: a.type || "application/octet-stream",
        content: Buffer.from(a.content || "", "base64"),
      })),
      receivedAt: new Date(),
    };
  }

  parseMailgunPayload(payload: any): ParsedEmail {
    return {
      from: payload.from,
      to: payload.recipient,
      subject: payload.subject,
      textBody: payload["body-plain"] || payload["stripped-text"] || "",
      htmlBody: payload["body-html"] || payload["stripped-html"] || "",
      attachments: [],
      receivedAt: new Date(),
    };
  }

  extractUserIdAndBroker(recipient: string): { userId: string; brokerId: string } | null {
    // Format: {userId}-{brokerId}@optin.domain.com
    const match = recipient.match(/^([a-zA-Z0-9_]+)-([a-zA-Z0-9_]+)@/);
    if (match) {
      return { userId: match[1], brokerId: match[2] };
    }
    return null;
  }
}

export const emailParser = new EmailInboundParser();
